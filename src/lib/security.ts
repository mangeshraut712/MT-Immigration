const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const RESTRICTED_CONTENT_PATTERNS = [
  /\bA-\d{9}\b/i,
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/,
  /\b(?:100% success|guarantee|promise you|will definitely win)\b/i,
];

export const API_SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy":
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;

export function withApiHeaders(extra?: HeadersInit) {
  const headers = new Headers(API_SECURITY_HEADERS);
  if (extra) {
    new Headers(extra).forEach((value, key) => {
      headers.set(key, value);
    });
  }
  return headers;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function isBlockedHostname(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.+$/, "");
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".localhost")
  );
}

export function sanitizePublicHttpsUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || CONTROL_CHARS.test(trimmed)) {
    return null;
  }

  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\") &&
    !trimmed.includes("\\") &&
    !trimmed.includes("://") &&
    !/[\s<>"']/.test(trimmed)
  ) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") {
      return null;
    }
    if (url.username || url.password || isBlockedHostname(url.hostname)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function sanitizeInternalPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return null;
  }
  if (value.includes("\\") || value.includes("://") || value.length > 300) {
    return null;
  }
  if (CONTROL_CHARS.test(value) || /\s/.test(value)) {
    return null;
  }
  return value;
}

export function sanitizeChatAction(
  action: { label?: unknown; link?: unknown } | null | undefined,
  fallback: { label: string; link: string },
) {
  if (!action || typeof action.label !== "string" || typeof action.link !== "string") {
    return fallback;
  }

  const link = sanitizeInternalPath(action.link);
  const label = action.label.replace(CONTROL_CHARS, "").trim();
  if (!link || label.length < 1 || label.length > 80) {
    return fallback;
  }

  return { label, link };
}

export function containsRestrictedContent(text: string) {
  return RESTRICTED_CONTENT_PATTERNS.some((pattern) => pattern.test(text));
}

export function safeAssistantText(candidate: string, fallback: string) {
  const trimmed = candidate.trim();
  if (!trimmed || containsRestrictedContent(trimmed)) {
    return { content: fallback, blocked: true as const };
  }

  return { content: trimmed, blocked: false as const };
}

export function isSafeContactHref(value: string, kind: "tel" | "mailto") {
  try {
    const url = new URL(value);
    if (url.username || url.password) {
      return false;
    }
    return url.protocol === `${kind}:`;
  } catch {
    return false;
  }
}

const IPV4_ADDRESS =
  /^(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const IPV6_ADDRESS = /^[0-9a-f:]{2,64}$/i;

function normalizeClientAddress(value: string) {
  const token = value.trim().split(/\s+/)[0] ?? "";
  if (IPV4_ADDRESS.test(token)) {
    return token;
  }
  if (token.includes(":") && IPV6_ADDRESS.test(token) && !token.includes(":::")) {
    return token;
  }
  return null;
}

export function clientKeyFromHeaders(
  getHeader: (name: string) => string | null,
) {
  const forwardedFor = getHeader("x-forwarded-for");
  const candidate =
    forwardedFor?.split(",")[0] || getHeader("x-real-ip") || "";
  return normalizeClientAddress(candidate) ?? "unknown";
}

export async function readLimitedBody(
  body: ReadableStream<Uint8Array> | null,
  maxBytes: number,
): Promise<
  | { ok: true; data: unknown }
  | { ok: false; status: 400 | 413; error: string }
> {
  const reader = body?.getReader();
  if (!reader) {
    return { ok: false, status: 400, error: "Invalid request body." };
  }

  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done || !value) {
      break;
    }

    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      return {
        ok: false,
        status: 413,
        error: `Request body is too large. Limit is ${maxBytes} bytes.`,
      };
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, data: JSON.parse(new TextDecoder().decode(bytes)) as unknown };
  } catch {
    return { ok: false, status: 400, error: "Invalid request body." };
  }
}

export function productionRateLimitBlock(options: {
  hasSharedConfig: boolean;
  backendFailed: boolean;
}) {
  const production =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production";
  if (!production) {
    return null;
  }
  if (!options.hasSharedConfig) {
    return "unconfigured" as const;
  }
  if (options.backendFailed) {
    return "unavailable" as const;
  }
  return null;
}
