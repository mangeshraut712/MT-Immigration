import { NextResponse } from 'next/server';

import { buildChatInstructions, getFallbackAssistantReply } from '@/server/ai/chatbot';
import {
  getOpenAIClient,
  getOpenAIModel,
  getOpenAIReasoningEffort,
} from '@/server/ai/openai';
import { takeRateLimitHit } from '@/server/rate-limit';
import { chatRequestSchema } from '@/server/schemas/chat';

export const runtime = 'nodejs';

const CHAT_LIMIT = 12;
const CHAT_WINDOW_MS = 60_000;
const FASTAPI_AGENTS_ENABLED = process.env.USE_FASTAPI_AGENTS === 'true';

function getFastApiAgentUrl(request: Request) {
  const configuredBaseUrl = process.env.FASTAPI_AGENT_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return new URL('/chat', configuredBaseUrl).toString();
  }

  return new URL('/api/agents/chat', request.url).toString();
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid chat payload.' }, { status: 400 });
  }

  const rateLimit = takeRateLimitHit({
    scope: 'chat',
    key: getClientKey(request),
    limit: CHAT_LIMIT,
    windowMs: CHAT_WINDOW_MS,
  });

  if (!rateLimit.ok) {
    return NextResponse.json(
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
    return NextResponse.json({ error: 'A user message is required.' }, { status: 400 });
  }

  const fallback = getFallbackAssistantReply(latestUserMessage.content);

  if (FASTAPI_AGENTS_ENABLED) {
    try {
      const fastApiResponse = await fetch(getFastApiAgentUrl(request), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: parsed.data.messages,
        }),
        cache: 'no-store',
      });

      if (fastApiResponse.ok) {
        const data = (await fastApiResponse.json()) as {
          content: string;
          suggestions?: string[];
          action?: { label: string; link: string };
          source?: string;
          agent?: string;
          model?: string;
        };

        return NextResponse.json({
          content: data.content || fallback.content,
          suggestions: data.suggestions || fallback.suggestions,
          action: data.action || fallback.action,
          source: data.source || 'fastapi',
          agent: data.agent,
          model: data.model,
        });
      }
    } catch (error) {
      console.error('FastAPI agent proxy error:', error);
    }
  }

  const client = getOpenAIClient();

  if (!client) {
    return NextResponse.json({
      content: fallback.content,
      suggestions: fallback.suggestions,
      action: fallback.action,
      source: 'fallback',
    });
  }

  try {
    const response = await client.responses.create({
      model: getOpenAIModel(),
      instructions: buildChatInstructions(fallback.content),
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

    const content = response.output_text.trim() || fallback.content;

    return NextResponse.json({
      content,
      suggestions: fallback.suggestions,
      action: fallback.action,
      source: 'openai',
      model: response.model,
    });
  } catch (error) {
    console.error('Chat API error:', error);

    return NextResponse.json({
      content: fallback.content,
      suggestions: fallback.suggestions,
      action: fallback.action,
      source: 'fallback',
    });
  }
}
