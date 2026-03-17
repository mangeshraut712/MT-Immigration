import 'server-only';

import OpenAI from 'openai';

const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4.1-mini';
const DEFAULT_OPENAI_MODEL = 'gpt-4.1-mini';
const DEFAULT_REASONING_EFFORT = 'low' as const;
const DEFAULT_OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_AI_TIMEOUT_MS = 15_000;
const REASONING_EFFORTS = new Set([
  'none',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
]);

let openAIClient: OpenAI | null | undefined;
let aiProvider: 'openrouter' | 'openai' | null | undefined;

function resolveAIProvider() {
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  if (openRouterKey) {
    return {
      provider: 'openrouter' as const,
      client: new OpenAI({
        apiKey: openRouterKey,
        baseURL:
          process.env.OPENROUTER_BASE_URL?.trim() || DEFAULT_OPENROUTER_BASE_URL,
        timeout: DEFAULT_AI_TIMEOUT_MS,
        maxRetries: 1,
        defaultHeaders: {
          ...(process.env.OPENROUTER_SITE_URL?.trim()
            ? { 'HTTP-Referer': process.env.OPENROUTER_SITE_URL.trim() }
            : {}),
          ...(process.env.OPENROUTER_APP_NAME?.trim()
            ? { 'X-Title': process.env.OPENROUTER_APP_NAME.trim() }
            : {}),
        },
      }),
    };
  }

  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  return {
    provider: openAIKey ? ('openai' as const) : null,
    client: openAIKey
      ? new OpenAI({
          apiKey: openAIKey,
          timeout: DEFAULT_AI_TIMEOUT_MS,
          maxRetries: 1,
        })
      : null,
  };
}

function shouldCacheResolvedClient() {
  return process.env.NODE_ENV === 'production';
}

export function getOpenAIClient() {
  if (shouldCacheResolvedClient() && openAIClient !== undefined) {
    return openAIClient;
  }

  const resolved = resolveAIProvider();
  aiProvider = resolved.provider;

  if (shouldCacheResolvedClient()) {
    openAIClient = resolved.client;
  }

  return resolved.client;
}

export function getAIProvider() {
  if (shouldCacheResolvedClient() && aiProvider !== undefined) {
    return aiProvider;
  }

  aiProvider = resolveAIProvider().provider;
  return aiProvider;
}

export function getOpenAIModel() {
  return getAIProvider() === 'openrouter'
    ? process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL
    : process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
}

export function getOpenAIReasoningEffort() {
  const configuredEffort =
    getAIProvider() === 'openrouter'
      ? process.env.OPENROUTER_REASONING_EFFORT?.trim()
      : process.env.OPENAI_REASONING_EFFORT?.trim();

  if (configuredEffort && REASONING_EFFORTS.has(configuredEffort)) {
    return configuredEffort as
      | 'none'
      | 'minimal'
      | 'low'
      | 'medium'
      | 'high'
      | 'xhigh';
  }

  return DEFAULT_REASONING_EFFORT;
}
