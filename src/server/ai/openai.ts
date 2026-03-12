import 'server-only';

import OpenAI from 'openai';

const DEFAULT_MODEL = 'openai/gpt-4.1-mini';
const DEFAULT_REASONING_EFFORT = 'low' as const;
const DEFAULT_OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
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

export function getOpenAIClient() {
  if (openAIClient !== undefined) {
    return openAIClient;
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  if (openRouterKey) {
    aiProvider = 'openrouter';
    openAIClient = new OpenAI({
      apiKey: openRouterKey,
      baseURL:
        process.env.OPENROUTER_BASE_URL?.trim() || DEFAULT_OPENROUTER_BASE_URL,
      defaultHeaders: {
        ...(process.env.OPENROUTER_SITE_URL?.trim()
          ? { 'HTTP-Referer': process.env.OPENROUTER_SITE_URL.trim() }
          : {}),
        ...(process.env.OPENROUTER_APP_NAME?.trim()
          ? { 'X-Title': process.env.OPENROUTER_APP_NAME.trim() }
          : {}),
      },
    });
    return openAIClient;
  }

  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  aiProvider = openAIKey ? 'openai' : null;
  openAIClient = openAIKey ? new OpenAI({ apiKey: openAIKey }) : null;

  return openAIClient;
}

export function getAIProvider() {
  if (aiProvider !== undefined) {
    return aiProvider;
  }

  if (process.env.OPENROUTER_API_KEY?.trim()) {
    aiProvider = 'openrouter';
    return aiProvider;
  }

  if (process.env.OPENAI_API_KEY?.trim()) {
    aiProvider = 'openai';
    return aiProvider;
  }

  aiProvider = null;
  return aiProvider;
}

export function getOpenAIModel() {
  return (
    process.env.OPENROUTER_MODEL?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    DEFAULT_MODEL
  );
}

export function getOpenAIReasoningEffort() {
  const configuredEffort =
    process.env.OPENROUTER_REASONING_EFFORT?.trim() ||
    process.env.OPENAI_REASONING_EFFORT?.trim();

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
