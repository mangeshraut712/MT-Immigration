import { NextResponse } from "next/server";

import {
  buildBenchReviewInstructions,
  buildChatInstructions,
  getFallbackAssistantReply,
} from "@/server/ai/chatbot";
import { benchReviewer } from "@/content/chatAgents";
import {
  getAIProvider,
  getOpenAIClient,
  getOpenAIModel,
  getOpenAIReasoningEffort,
} from "@/server/ai/openai";
import {
  getClientKey,
  parseSearchParams,
  rejectLargeRequest,
  rejectNonJsonRequest,
  rejectUntrustedOrigin,
} from "@/server/request-guards";
import { takeRateLimitHit } from "@/server/rate-limit";
import {
  chatRequestSchema,
  type ChatMessageInput,
} from "@/server/schemas/chat";
import { emptySearchParamsSchema } from "@/server/schemas/request";

export const runtime = "nodejs";
export const maxDuration = 20;

const CHAT_LIMIT = 12;
const CHAT_WINDOW_MS = 60_000;
const CHAT_STATUS_LIMIT = 30;
const FASTAPI_AGENTS_ENABLED = process.env.USE_FASTAPI_AGENTS === "true";
const IS_VERCEL_DEPLOYMENT = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV,
);
const FASTAPI_AGENT_TIMEOUT_MS = 10_000;
const FASTAPI_AGENT_SECRET_HEADER = "x-agent-shared-secret";
const CHAT_REQUEST_MAX_BYTES = 32_000;
const CHAT_CONTEXT_MAX_MESSAGES = 8;
const CHAT_CONTEXT_MAX_CHARACTERS = 8_000;
const BENCH_REVIEW_ENABLED =
  process.env.AI_BENCH_REVIEW_ENABLED?.trim() === "true" ||
  (!process.env.AI_BENCH_REVIEW_ENABLED?.trim() &&
    process.env.NODE_ENV === "production");
let hasWarnedNoFastApiTarget = false;
let hasWarnedMissingFastApiSecret = false;
let hasWarnedAiAuthFailure = false;

function jsonNoStore(
  body: unknown,
  init?: (ResponseInit & { headers?: HeadersInit }) | undefined,
) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}

function getFastApiAgentUrl(request: Request) {
  const configuredBaseUrl = process.env.FASTAPI_AGENT_BASE_URL?.trim();

  if (configuredBaseUrl) {
    const url = new URL(configuredBaseUrl);
    if (!url.pathname.endsWith("/chat")) {
      url.pathname = `${url.pathname.replace(/\/$/, "")}/chat`;
    }
    return url.toString();
  }

  if (IS_VERCEL_DEPLOYMENT) {
    return new URL("/api/agents/chat", request.url).toString();
  }

  return null;
}

function isAuthenticationFailure(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as {
    status?: number;
    code?: number;
    message?: string;
  };
  return (
    maybeError.status === 401 ||
    maybeError.code === 401 ||
    maybeError.message?.toLowerCase().includes("authentication") === true
  );
}

function containsRestrictedContent(text: string) {
  const restrictedPatterns = [
    /\b(A-\d{9})\b/i,          // A-Number
    /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/, // SSN
    /\b(100% success|guarantee|promise you|will definitely win)\b/i, // Overconfident claims
  ];
  return restrictedPatterns.some((pattern) => pattern.test(text));
}

function pruneChatContext(messages: ChatMessageInput[]) {
  if (messages.length <= 1) {
    return messages;
  }

  const selectedMessages: ChatMessageInput[] = [];
  const firstMessage = messages[0];
  let totalCharacters = firstMessage.content.length;

  for (const message of [...messages.slice(1)].reverse()) {
    const contentLength = message.content.length;
    const wouldExceedMessageLimit =
      selectedMessages.length >= CHAT_CONTEXT_MAX_MESSAGES - 1;
    const wouldExceedCharacterBudget =
      selectedMessages.length > 0 &&
      totalCharacters + contentLength > CHAT_CONTEXT_MAX_CHARACTERS;

    if (wouldExceedMessageLimit || wouldExceedCharacterBudget) {
      break;
    }

    selectedMessages.push(message);
    totalCharacters += contentLength;
  }

  return [firstMessage, ...selectedMessages.reverse()];
}

export async function GET(request: Request) {
  const queryParams = parseSearchParams(request, emptySearchParamsSchema);
  if (queryParams instanceof NextResponse) {
    return queryParams;
  }

  const rateLimit = await takeRateLimitHit({
    scope: "chat-status",
    key: getClientKey(request),
    limit: CHAT_STATUS_LIMIT,
    windowMs: CHAT_WINDOW_MS,
  });

  if (rateLimit.reason) {
    return jsonNoStore(
      {
        error:
          "Chat status is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }

  if (!rateLimit.ok) {
    return jsonNoStore(
      { error: "Too many status checks. Please wait a minute and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1_000), 1),
          ),
        },
      },
    );
  }

  return jsonNoStore({
    ok: true,
    provider: getAIProvider() || "fallback",
    fastApiAgentsEnabled: FASTAPI_AGENTS_ENABLED,
    fastApiTargetConfigured: Boolean(getFastApiAgentUrl(request)),
    benchReviewEnabled: BENCH_REVIEW_ENABLED,
  });
}

export async function POST(request: Request) {
  const queryParams = parseSearchParams(request, emptySearchParamsSchema);
  if (queryParams instanceof NextResponse) {
    return queryParams;
  }

  const contentTypeError = rejectNonJsonRequest(request);
  if (contentTypeError) {
    return contentTypeError;
  }

  const requestTooLargeError = rejectLargeRequest(
    request,
    CHAT_REQUEST_MAX_BYTES,
  );
  if (requestTooLargeError) {
    return requestTooLargeError;
  }

  const originError = rejectUntrustedOrigin(request);
  if (originError) {
    return originError;
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonNoStore({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonNoStore({ error: "Invalid chat payload." }, { status: 400 });
  }

  const rateLimit = await takeRateLimitHit({
    scope: "chat",
    key: getClientKey(request),
    limit: CHAT_LIMIT,
    windowMs: CHAT_WINDOW_MS,
  });

  if (rateLimit.reason) {
    return jsonNoStore(
      { error: "Chat is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  if (!rateLimit.ok) {
    return jsonNoStore(
      {
        error: "Too many chat messages. Please wait a minute and try again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1_000), 1),
          ),
        },
      },
    );
  }

  const latestUserMessage = [...parsed.data.messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!latestUserMessage) {
    return jsonNoStore(
      { error: "A user message is required." },
      { status: 400 },
    );
  }

  const boundedMessages = pruneChatContext(parsed.data.messages);

  const fallback = getFallbackAssistantReply(
    latestUserMessage.content,
    parsed.data.agent,
  );

  if (FASTAPI_AGENTS_ENABLED) {
    const fastApiAgentUrl = getFastApiAgentUrl(request);
    const fastApiSharedSecret = process.env.FASTAPI_AGENT_SHARED_SECRET?.trim();

    if (!fastApiAgentUrl) {
      if (!hasWarnedNoFastApiTarget) {
        hasWarnedNoFastApiTarget = true;
        console.warn(
          "FastAPI agents are enabled, but no FastAPI target is reachable in this environment. Using direct AI path.",
        );
      }
    } else if (!fastApiSharedSecret) {
      if (!hasWarnedMissingFastApiSecret) {
        hasWarnedMissingFastApiSecret = true;
        console.error(
          "FastAPI agents are enabled, but FASTAPI_AGENT_SHARED_SECRET is not configured.",
        );
      }
    } else {
      try {
        const fastApiResponse = await fetch(fastApiAgentUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [FASTAPI_AGENT_SECRET_HEADER]: fastApiSharedSecret,
          },
          body: JSON.stringify({
            messages: boundedMessages,
            agent: parsed.data.agent,
          }),
          signal: AbortSignal.timeout(FASTAPI_AGENT_TIMEOUT_MS),
          cache: "no-store",
        });

        if (fastApiResponse.ok) {
          const data = (await fastApiResponse.json()) as {
            content: string;
            suggestions?: string[];
            action?: { label: string; link: string };
            source?: string;
            degraded?: boolean;
            agent?: string;
            agentTitle?: string;
            agentDescription?: string;
            reviewedBy?: string;
            model?: string;
          };

          if (!data.degraded) {
            return jsonNoStore({
              content: data.content || fallback.content,
              suggestions: data.suggestions || fallback.suggestions,
              action: data.action || fallback.action,
              source: data.source || "fastapi",
              degraded: false,
              agent: data.agent || fallback.agent,
              agentTitle: data.agentTitle || fallback.agentCard.title,
              agentDescription:
                data.agentDescription || fallback.agentCard.description,
              reviewedBy: data.reviewedBy,
              model: data.model,
            });
          }

          console.warn(
            "FastAPI agent returned degraded fallback; using direct AI path.",
          );
        } else {
          const responseSnippet = (await fastApiResponse.text()).slice(0, 240);
          console.error("FastAPI agent proxy returned non-OK response:", {
            status: fastApiResponse.status,
            body: responseSnippet,
          });
        }
      } catch (error) {
        console.error("FastAPI agent proxy error:", error);
      }
    }
  }

  const client = getOpenAIClient();

  if (!client) {
    return jsonNoStore({
      content: fallback.content,
      suggestions: fallback.suggestions,
      action: fallback.action,
      source: "fallback",
      degraded: true,
      agent: fallback.agent,
      agentTitle: fallback.agentCard.title,
      agentDescription: fallback.agentCard.description,
      reviewedBy: benchReviewer.title,
    });
  }

  try {
    const specialistResponse = await client.responses.create({
      model: getOpenAIModel(),
      instructions: buildChatInstructions(fallback.content, fallback.agent),
      input: boundedMessages.map((message) => ({
        role: message.role,
        content: [{ type: "input_text" as const, text: message.content }],
      })),
      max_output_tokens: 500,
      reasoning: {
        effort: getOpenAIReasoningEffort(),
      },
      store: false,
    });

    const specialistDraft =
      specialistResponse.output_text.trim() || fallback.content;
    if (!BENCH_REVIEW_ENABLED) {
      return jsonNoStore({
        content: specialistDraft,
        suggestions: fallback.suggestions,
        action: fallback.action,
        source: getAIProvider() || "openai",
        degraded: false,
        agent: fallback.agent,
        agentTitle: fallback.agentCard.title,
        agentDescription: fallback.agentCard.description,
        model: specialistResponse.model,
      });
    }

    try {
      const benchReview = await client.responses.create({
        model: getOpenAIModel(),
        instructions: buildBenchReviewInstructions(fallback.agent),
        input: specialistDraft,
        max_output_tokens: 500,
        reasoning: {
          effort: "minimal",
        },
        store: false,
      });

      const content = benchReview.output_text.trim() || specialistDraft;

      if (containsRestrictedContent(content)) {
        return jsonNoStore({
          content: fallback.content,
          suggestions: fallback.suggestions,
          action: fallback.action,
          source: "fallback",
          degraded: true,
          agent: fallback.agent,
          agentTitle: fallback.agentCard.title,
          agentDescription: fallback.agentCard.description,
          reviewedBy: benchReviewer.title,
        });
      }

      return jsonNoStore({
        content,
        suggestions: fallback.suggestions,
        action: fallback.action,
        source: getAIProvider() || "openai",
        degraded: false,
        agent: fallback.agent,
        agentTitle: fallback.agentCard.title,
        agentDescription: fallback.agentCard.description,
        reviewedBy: benchReviewer.title,
        model: specialistResponse.model,
      });
    } catch (error) {
      console.error("Bench review error:", error);

      return jsonNoStore({
        content: specialistDraft,
        suggestions: fallback.suggestions,
        action: fallback.action,
        source: getAIProvider() || "openai",
        degraded: false,
        agent: fallback.agent,
        agentTitle: fallback.agentCard.title,
        agentDescription: fallback.agentCard.description,
        model: specialistResponse.model,
      });
    }
  } catch (error) {
    if (isAuthenticationFailure(error)) {
      if (!hasWarnedAiAuthFailure) {
        hasWarnedAiAuthFailure = true;
        console.warn(
          "AI provider authentication failed. Chat is falling back to the built-in response set until provider credentials are fixed.",
        );
      }
    } else {
      console.error("Chat API error:", error);
    }

    return jsonNoStore({
      content: fallback.content,
      suggestions: fallback.suggestions,
      action: fallback.action,
      source: "fallback",
      degraded: true,
      agent: fallback.agent,
      agentTitle: fallback.agentCard.title,
      agentDescription: fallback.agentCard.description,
      reviewedBy: benchReviewer.title,
    });
  }
}
