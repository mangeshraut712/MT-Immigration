import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
const supportedProviderKeys = ['OPENROUTER_API_KEY', 'OPENAI_API_KEY'];
const ignoredProviderKeys = [
  'ANTHROPIC_API_KEY',
  'COHERE_API_KEY',
  'MISTRAL_API_KEY',
  'GOOGLE_AI_KEY',
];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const entries = {};
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
}

const cwd = process.cwd();
const fileEnv = envFiles.reduce(
  (entries, fileName) => ({
    ...entries,
    ...parseEnvFile(path.join(cwd, fileName)),
  }),
  {},
);
const env = {
  ...fileEnv,
  ...process.env,
};
const isCiEnvironment = env.CI === 'true' || env.GITHUB_ACTIONS === 'true';
const isVercelDeployment = Boolean(env.VERCEL || env.VERCEL_ENV);

const errors = [];
const warnings = [];
const notices = [];

const useFastApiAgents = env.USE_FASTAPI_AGENTS?.trim() === 'true';
const hasOpenRouterKey = Boolean(env.OPENROUTER_API_KEY?.trim());
const hasOpenAIKey = Boolean(env.OPENAI_API_KEY?.trim());
const hasFastApiSecret = Boolean(env.FASTAPI_AGENT_SHARED_SECRET?.trim());
const hasSharedRateLimitConfig = Boolean(
  env.UPSTASH_REDIS_REST_URL?.trim() && env.UPSTASH_REDIS_REST_TOKEN?.trim(),
);
const configuredIgnoredProviderKeys = ignoredProviderKeys.filter((key) =>
  Boolean(env[key]?.trim()),
);

function isAbsoluteUrl(value) {
  if (!value) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

if (useFastApiAgents && !hasFastApiSecret) {
  errors.push('FASTAPI_AGENT_SHARED_SECRET is required when USE_FASTAPI_AGENTS=true.');
}

if (useFastApiAgents && !hasOpenRouterKey) {
  warnings.push(
    'USE_FASTAPI_AGENTS=true but OPENROUTER_API_KEY is unset. The FastAPI agents service will only return fallback responses.',
  );
}

if (!isAbsoluteUrl(env.FASTAPI_AGENT_BASE_URL?.trim())) {
  errors.push('FASTAPI_AGENT_BASE_URL must be an absolute URL when it is set.');
}

if (hasOpenAIKey && env.OPENAI_MODEL?.trim().startsWith('openai/')) {
  errors.push(
    'OPENAI_MODEL should be an OpenAI model id such as "gpt-4.1-mini", not an OpenRouter slug.',
  );
}

if (!hasOpenRouterKey && !hasOpenAIKey && !isCiEnvironment) {
  errors.push(
    `No supported AI provider key is configured. Set one of: ${supportedProviderKeys.join(', ')}.`,
  );
}

if (!hasOpenRouterKey && !hasOpenAIKey && isCiEnvironment) {
  notices.push('Skipping runtime AI provider-key requirement in CI.');
}

if (configuredIgnoredProviderKeys.length > 0) {
  warnings.push(
    `This repo ignores unsupported provider keys: ${configuredIgnoredProviderKeys.join(', ')}.`,
  );
}

if (!env.INTAKE_WEBHOOK_URL?.trim()) {
  notices.push(
    'INTAKE_WEBHOOK_URL is unset. The intake API will reject submissions until a webhook is configured.',
  );
}

if (env.FASTAPI_AGENT_BASE_URL?.trim() && !useFastApiAgents) {
  notices.push(
    'FASTAPI_AGENT_BASE_URL is set, but USE_FASTAPI_AGENTS is not true. The Next.js chat route will not use the FastAPI service.',
  );
}

if (useFastApiAgents && !env.FASTAPI_AGENT_BASE_URL?.trim() && !isVercelDeployment) {
  notices.push(
    'USE_FASTAPI_AGENTS=true without FASTAPI_AGENT_BASE_URL only works on Vercel. Local Next.js dev will skip the FastAPI proxy and use the direct AI path.',
  );
}

if (env.NODE_ENV === 'production' && !hasSharedRateLimitConfig) {
  errors.push(
    'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production for shared API rate limiting.',
  );
}

for (const notice of notices) {
  console.log(`NOTICE: ${notice}`);
}

for (const warning of warnings) {
  console.warn(`WARNING: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log('AI configuration checks passed.');
}
