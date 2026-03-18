import { NextResponse } from 'next/server';

import {
  buildBenchReviewInstructions,
  buildChatInstructions,
  getFallbackAssistantReply,
} from '@/server/ai/chatbot';
import { benchReviewer } from '@/content/chatAgents';
import {
  getAIProvider,
  getOpenAIClient,
  getOpenAIModel,
  getOpenAIReasoningEffort,
} from '@/server/ai/openai';
import {
  getClientKey,
  rejectUnexpectedSearchParams,
  rejectUntrustedOrigin,
} from '@/server/request-guards';
import { takeRateLimitHit } from '@/server/rate-limit';
import { chatRequestSchema } from '@/server/schemas/chat';

export const runtime = 'nodejs';
export const maxDuration = 20;

const CHAT_LIMIT = 12;
const CHAT_WINDOW_MS = 60_000;
const CHAT_STATUS_LIMIT = 30;
const FASTAPI_AGENTS_ENABLED = process.env.USE_FASTAPI_AGENTS === 'true';
const IS_VERCEL_DEPLOYMENT = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
const FASTAPI_AGENT_TIMEOUT_MS = 10_000;
const FASTAPI_AGENT_SECRET_HEADER = 'x-agent-shared-secret';
const BENCH_REVIEW_ENABLED =
  process.env.AI_BENCH_REVIEW_ENABLED?.trim() === 'true' ||
  (!process.env.AI_BENCH_REVIEW_ENABLED?.trim() && process.env.NODE_ENV === 'production');
let hasWarnedNoFastApiTarget = false;
let hasWarnedMissingFastApiSecret = false;

function jsonNoStore(body: unknown, init?: (ResponseInit & { headers?: HeadersInit }) | undefined) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init?.headers ?? {}),
    },
  });
}

function getFastApiAgentUrl(request: Request) {
  const configuredBaseUrl = process.env.FASTAPI_AGENT_BASE_URL?.trim();

  if (configuredBaseUrl) {
    const url = new URL(configuredBaseUrl);
    if (!url.pathname.endsWith('/chat')) {
      url.pathname = `${url.pathname.replace(/\/$/, '')}/chat`;
    }
    return url.toString();
  }

  if (IS_VERCEL_DEPLOYMENT) {
    return new URL('/api/agents/chat', request.url).toString();
  }

  return null;
}

export async function GET(request: Request) {
  const queryError = rejectUnexpectedSearchParams(request);
  if (queryError) {
    return queryError;
  }

  const rateLimit = await takeRateLimitHit({
    scope: 'chat-status',
    key: getClientKey(request),
    limit: CHAT_STATUS_LIMIT,
    windowMs: CHAT_WINDOW_MS,
  });

  if (rateLimit.reason) {
    return jsonNoStore(
      { error: 'Chat status is temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  if (!rateLimit.ok) {
    return jsonNoStore(
      { error: 'Too many status checks. Please wait a minute and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1_000), 1),
          ),
        },
      },
    );
  }

  return jsonNoStore({
    ok: true,
    provider: getAIProvider() || 'fallback',
    fastApiAgentsEnabled: FASTAPI_AGENTS_ENABLED,
    fastApiTargetConfigured: Boolean(getFastApiAgentUrl(request)),
    benchReviewEnabled: BENCH_REVIEW_ENABLED,
  });
}

export async function POST(request: Request) {
  const queryError = rejectUnexpectedSearchParams(request);
  if (queryError) {
    return queryError;
  }

  const originError = rejectUntrustedOrigin(request);
  if (originError) {
    return originError;
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonNoStore({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonNoStore({ error: 'Invalid chat payload.' }, { status: 400 });
  }

  const rateLimit = await takeRateLimitHit({
    scope: 'chat',
    key: getClientKey(request),
    limit: CHAT_LIMIT,
    windowMs: CHAT_WINDOW_MS,
  });

  if (rateLimit.reason) {
    return jsonNoStore(
      { error: 'Chat is temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  if (!rateLimit.ok) {
    return jsonNoStore(
      {
        error: 'Too many chat messages. Please wait a minute and try again.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1_000), 1),
          ),
        },
      },
    );
  }

  const latestUserMessage = [...parsed.data.messages]
    .reverse()
    .find((message) => message.role === 'user');

  if (!latestUserMessage) {
    return jsonNoStore({ error: 'A user message is required.' }, { status: 400 });
  }

  const fallback = getFallbackAssistantReply(latestUserMessage.content, parsed.data.agent);

  if (FASTAPI_AGENTS_ENABLED) {
    const fastApiAgentUrl = getFastApiAgentUrl(request);
    const fastApiSharedSecret = process.env.FASTAPI_AGENT_SHARED_SECRET?.trim();

    if (!fastApiAgentUrl) {
      if (!hasWarnedNoFastApiTarget) {
        hasWarnedNoFastApiTarget = true;
        console.warn(
          'FastAPI agents are enabled, but no FastAPI target is reachable in this environment. Using direct AI path.',
        );
      }
    } else if (!fastApiSharedSecret) {
      if (!hasWarnedMissingFastApiSecret) {
        hasWarnedMissingFastApiSecret = true;
        console.error(
          'FastAPI agents are enabled, but FASTAPI_AGENT_SHARED_SECRET is not configured.',
        );
      }
    } else {
      try {
        const fastApiResponse = await fetch(fastApiAgentUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            [FASTAPI_AGENT_SECRET_HEADER]: fastApiSharedSecret,
          },
          body: JSON.stringify({
            messages: parsed.data.messages,
            agent: parsed.data.agent,
          }),
          signal: AbortSignal.timeout(FASTAPI_AGENT_TIMEOUT_MS),
          cache: 'no-store',
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
              source: data.source || 'fastapi',
              degraded: false,
              agent: data.agent || fallback.agent,
              agentTitle: data.agentTitle || fallback.agentCard.title,
              agentDescription: data.agentDescription || fallback.agentCard.description,
              reviewedBy: data.reviewedBy,
              model: data.model,
            });
          }

          console.warn('FastAPI agent returned degraded fallback; using direct AI path.');
        } else {
          const responseSnippet = (await fastApiResponse.text()).slice(0, 240);
          console.error('FastAPI agent proxy returned non-OK response:', {
            status: fastApiResponse.status,
            body: responseSnippet,
          });
        }
      } catch (error) {
        console.error('FastAPI agent proxy error:', error);
      }
    }
  }

  const client = getOpenAIClient();

  if (!client) {
    return jsonNoStore({
      content: fallback.content,
      suggestions: fallback.suggestions,
      action: fallback.action,
      source: 'fallback',
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
      input: parsed.data.messages.map((message) => ({
        role: message.role,
        content: [{ type: 'input_text' as const, text: message.content }],
      })),
      max_output_tokens: 500,
      reasoning: {
        effort: getOpenAIReasoningEffort(),
      },
      store: false,
    });

    const specialistDraft = specialistResponse.output_text.trim() || fallback.content;
    if (!BENCH_REVIEW_ENABLED) {
      return jsonNoStore({
        content: specialistDraft,
        suggestions: fallback.suggestions,
        action: fallback.action,
        source: getAIProvider() || 'openai',
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
          effort: 'minimal',
        },
        store: false,
      });

      const content = benchReview.output_text.trim() || specialistDraft;

      return jsonNoStore({
        content,
        suggestions: fallback.suggestions,
        action: fallback.action,
        source: getAIProvider() || 'openai',
        degraded: false,
        agent: fallback.agent,
        agentTitle: fallback.agentCard.title,
        agentDescription: fallback.agentCard.description,
        reviewedBy: benchReviewer.title,
        model: specialistResponse.model,
      });
    } catch (error) {
      console.error('Bench review error:', error);

      return jsonNoStore({
        content: specialistDraft,
        suggestions: fallback.suggestions,
        action: fallback.action,
        source: getAIProvider() || 'openai',
        degraded: false,
        agent: fallback.agent,
        agentTitle: fallback.agentCard.title,
        agentDescription: fallback.agentCard.description,
        model: specialistResponse.model,
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);

    return jsonNoStore({
      content: fallback.content,
      suggestions: fallback.suggestions,
      action: fallback.action,
      source: 'fallback',
      degraded: true,
      agent: fallback.agent,
      agentTitle: fallback.agentCard.title,
      agentDescription: fallback.agentCard.description,
      reviewedBy: benchReviewer.title,
    });
  }
}
