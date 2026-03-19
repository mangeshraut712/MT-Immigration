import "server-only";

import OpenAI from "openai";

const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4.1-mini";
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";
const DEFAULT_REASONING_EFFORT = "low" as const;
const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_AI_TIMEOUT_MS = 15_000;
const REASONING_EFFORTS = new Set([
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
]);

let openAIClient: OpenAI | null | undefined;
let aiProvider: "openrouter" | "openai" | null | undefined;

const PLACEHOLDER_SECRET_VALUES = new Set([
  "your_openrouter_api_key",
  "your_openai_api_key",
  "replace_with_a_long_random_secret",
  "changeme",
  "change-me",
  "placeholder",
  "example",
]);

function readConfiguredSecret(value?: string) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return null;
  }

  const normalizedValue = trimmedValue.toLowerCase();
  if (
    PLACEHOLDER_SECRET_VALUES.has(normalizedValue) ||
    normalizedValue.startsWith("your_") ||
    normalizedValue.startsWith("replace_with_")
  ) {
    return null;
  }

  return trimmedValue;
}

function resolveAIProvider() {
  const openRouterKey = readConfiguredSecret(process.env.OPENROUTER_API_KEY);
  if (openRouterKey) {
    return {
      provider: "openrouter" as const,
      client: new OpenAI({
        apiKey: openRouterKey,
        baseURL:
          process.env.OPENROUTER_BASE_URL?.trim() ||
          DEFAULT_OPENROUTER_BASE_URL,
        timeout: DEFAULT_AI_TIMEOUT_MS,
        maxRetries: 1,
        defaultHeaders: {
          ...(process.env.OPENROUTER_SITE_URL?.trim()
            ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL.trim() }
            : {}),
          ...(process.env.OPENROUTER_APP_NAME?.trim()
            ? { "X-Title": process.env.OPENROUTER_APP_NAME.trim() }
            : {}),
        },
      }),
    };
  }

  const openAIKey = readConfiguredSecret(process.env.OPENAI_API_KEY);
  return {
    provider: openAIKey ? ("openai" as const) : null,
    client: openAIKey
      ? new OpenAI({
          apiKey: openAIKey,
          timeout: DEFAULT_AI_TIMEOUT_MS,
          maxRetries: 1,
        })
      : null,
  };
}

export function hasConfiguredOpenAIKey() {
  return Boolean(readConfiguredSecret(process.env.OPENAI_API_KEY));
}

function shouldCacheResolvedClient() {
  return process.env.NODE_ENV === "production";
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
  return getAIProvider() === "openrouter"
    ? process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL
    : process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
}

export function getOpenAIReasoningEffort() {
  const configuredEffort =
    getAIProvider() === "openrouter"
      ? process.env.OPENROUTER_REASONING_EFFORT?.trim()
      : process.env.OPENAI_REASONING_EFFORT?.trim();

  if (configuredEffort && REASONING_EFFORTS.has(configuredEffort)) {
    return configuredEffort as
      | "none"
      | "minimal"
      | "low"
      | "medium"
      | "high"
      | "xhigh";
  }

  return DEFAULT_REASONING_EFFORT;
}
