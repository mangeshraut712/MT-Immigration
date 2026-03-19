import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const envFiles = [".env", ".env.local", ".env.development", ".env.production"];
const supportedProviderKeys = ["OPENROUTER_API_KEY", "OPENAI_API_KEY"];
const ignoredProviderKeys = [
  "ANTHROPIC_API_KEY",
  "COHERE_API_KEY",
  "MISTRAL_API_KEY",
  "GOOGLE_AI_KEY",
];
const placeholderSecretValues = new Set([
  "your_openrouter_api_key",
  "your_openai_api_key",
  "replace_with_a_long_random_secret",
  "changeme",
  "change-me",
  "placeholder",
  "example",
]);

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const entries = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");
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

function readConfiguredSecret(value) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "";
  }

  const normalized = trimmed.toLowerCase();
  if (
    placeholderSecretValues.has(normalized) ||
    normalized.startsWith("your_") ||
    normalized.startsWith("replace_with_")
  ) {
    return "";
  }

  return trimmed;
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
const isCiEnvironment = env.CI === "true" || env.GITHUB_ACTIONS === "true";
const isVercelDeployment = Boolean(env.VERCEL || env.VERCEL_ENV);
const isProductionRuntime =
  env.NODE_ENV === "production" || env.VERCEL_ENV === "production";

const errors = [];
const warnings = [];
const notices = [];

const useFastApiAgents = env.USE_FASTAPI_AGENTS?.trim() === "true";
const hasOpenRouterKey = Boolean(readConfiguredSecret(env.OPENROUTER_API_KEY));
const hasOpenAIKey = Boolean(readConfiguredSecret(env.OPENAI_API_KEY));
const hasFastApiSecret = Boolean(
  readConfiguredSecret(env.FASTAPI_AGENT_SHARED_SECRET),
);
const hasSharedRateLimitConfig = Boolean(
  env.UPSTASH_REDIS_REST_URL?.trim() && env.UPSTASH_REDIS_REST_TOKEN?.trim(),
);
const hasIntakeWebhookUrl = Boolean(env.INTAKE_WEBHOOK_URL?.trim());
const hasIntakeWebhookAuth = Boolean(
  env.INTAKE_WEBHOOK_BEARER_TOKEN?.trim() ||
    env.INTAKE_WEBHOOK_SIGNING_SECRET?.trim(),
);
const hasResendConfig = Boolean(
  env.RESEND_API_KEY?.trim() && env.INTAKE_CONFIRMATION_FROM_EMAIL?.trim(),
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
  errors.push(
    "FASTAPI_AGENT_SHARED_SECRET is required when USE_FASTAPI_AGENTS=true.",
  );
}

if (useFastApiAgents && !hasOpenRouterKey) {
  warnings.push(
    "USE_FASTAPI_AGENTS=true but OPENROUTER_API_KEY is unset. The FastAPI agents service will only return fallback responses.",
  );
}

if (!isAbsoluteUrl(env.FASTAPI_AGENT_BASE_URL?.trim())) {
  errors.push("FASTAPI_AGENT_BASE_URL must be an absolute URL when it is set.");
}

if (hasOpenAIKey && env.OPENAI_MODEL?.trim().startsWith("openai/")) {
  errors.push(
    'OPENAI_MODEL should be an OpenAI model id such as "gpt-4.1-mini", not an OpenRouter slug.',
  );
}

if (
  !hasOpenRouterKey &&
  !hasOpenAIKey &&
  !isCiEnvironment &&
  isProductionRuntime
) {
  errors.push(
    `No supported AI provider key is configured. Set one of: ${supportedProviderKeys.join(", ")}.`,
  );
}

if (!hasOpenRouterKey && !hasOpenAIKey && isCiEnvironment) {
  notices.push("Skipping runtime AI provider-key requirement in CI.");
}

if (
  !hasOpenRouterKey &&
  !hasOpenAIKey &&
  !isCiEnvironment &&
  !isProductionRuntime
) {
  notices.push(
    "No AI provider key is configured. Local chat and insights will use the built-in fallback path until OPENROUTER_API_KEY or OPENAI_API_KEY is set.",
  );
}

if (configuredIgnoredProviderKeys.length > 0) {
  warnings.push(
    `This repo ignores unsupported provider keys: ${configuredIgnoredProviderKeys.join(", ")}.`,
  );
}

if (!hasIntakeWebhookUrl) {
  notices.push(
    "INTAKE_WEBHOOK_URL is unset. The intake API will reject submissions until a webhook is configured.",
  );
}

if (hasIntakeWebhookUrl && !hasIntakeWebhookAuth) {
  warnings.push(
    "INTAKE_WEBHOOK_URL is configured without INTAKE_WEBHOOK_BEARER_TOKEN or INTAKE_WEBHOOK_SIGNING_SECRET. Outbound webhook authentication is recommended for production.",
  );
}

if (env.RESEND_API_KEY?.trim() && !env.INTAKE_CONFIRMATION_FROM_EMAIL?.trim()) {
  errors.push(
    "INTAKE_CONFIRMATION_FROM_EMAIL is required when RESEND_API_KEY is configured.",
  );
}

if (!hasResendConfig) {
  notices.push(
    "Confirmation emails are disabled. Set RESEND_API_KEY and INTAKE_CONFIRMATION_FROM_EMAIL to enable them.",
  );
}

const hasServerSidePaymentTargets = Boolean(
  env.STRIPE_CHECKOUT_URL?.trim() ||
    env.PAYPAL_CHECKOUT_URL?.trim() ||
    env.WIRE_TRANSFER_REQUEST_URL?.trim(),
);
if (!hasServerSidePaymentTargets) {
  notices.push(
    "Server-side payment redirect URLs are not configured. Hosted payment buttons will fall back to the contact flow unless the legacy NEXT_PUBLIC_* payment URLs remain in use.",
  );
}

const firmPhoneDisplay = env.NEXT_PUBLIC_FIRM_PHONE_DISPLAY?.trim() || "";
const firmEmail = env.NEXT_PUBLIC_FIRM_EMAIL?.trim() || "";
if (!firmPhoneDisplay || firmPhoneDisplay.includes("555")) {
  warnings.push(
    "NEXT_PUBLIC_FIRM_PHONE_DISPLAY is unset or still using placeholder phone data. Replace it before production.",
  );
}

if (!firmEmail || firmEmail === "help@mtimmigration.com") {
  warnings.push(
    "NEXT_PUBLIC_FIRM_EMAIL is unset or still using placeholder email data. Replace it before production.",
  );
}

if (env.FASTAPI_AGENT_BASE_URL?.trim() && !useFastApiAgents) {
  notices.push(
    "FASTAPI_AGENT_BASE_URL is set, but USE_FASTAPI_AGENTS is not true. The Next.js chat route will not use the FastAPI service.",
  );
}

if (
  useFastApiAgents &&
  !env.FASTAPI_AGENT_BASE_URL?.trim() &&
  !isVercelDeployment
) {
  notices.push(
    "USE_FASTAPI_AGENTS=true without FASTAPI_AGENT_BASE_URL only works on Vercel. Local Next.js dev will skip the FastAPI proxy and use the direct AI path.",
  );
}

if (env.NODE_ENV === "production" && !hasSharedRateLimitConfig) {
  errors.push(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production for shared API rate limiting.",
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
  console.log("AI configuration checks passed.");
}
