import { NextResponse } from "next/server";
import { type ZodType } from "zod";

import { getSiteUrl } from "@/config/site";

function getTrustedOrigins() {
  const origins = new Set<string>([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);

  // Canonical site URL (usually NEXT_PUBLIC_SITE_URL)
  try {
    origins.add(new URL(getSiteUrl()).origin);
  } catch {
    // Keep the local-development defaults only.
  }

  // Vercel preview / production URLs
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    origins.add(
      vercelUrl.startsWith("http")
        ? new URL(vercelUrl).origin
        : `https://${vercelUrl}`,
    );
  }

  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProdUrl) {
    origins.add(
      vercelProdUrl.startsWith("http")
        ? new URL(vercelProdUrl).origin
        : `https://${vercelProdUrl}`,
    );
  }

  // Optional configurable allowlist: comma-separated origins
  const extra = process.env.TRUSTED_ORIGINS?.trim();
  if (extra) {
    for (const raw of extra.split(",")) {
      const trimmed = raw.trim();
      if (trimmed) {
        try {
          origins.add(new URL(trimmed).origin);
        } catch {
          // Silently skip malformed entries.
        }
      }
    }
  }

  return origins;
}

export function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function searchParamsToRecord(searchParams: URLSearchParams) {
  const entries = new Map<string, string[]>();

  for (const [key, value] of searchParams.entries()) {
    const existing = entries.get(key);
    if (existing) {
      existing.push(value);
      continue;
    }

    entries.set(key, [value]);
  }

  return Object.fromEntries(
    [...entries.entries()].map(([key, values]) => [
      key,
      values.length === 1 ? values[0] : values,
    ]),
  );
}

export function parseSearchParams<T>(request: Request, schema: ZodType<T>) {
  const rawSearchParams = searchParamsToRecord(new URL(request.url).searchParams);
  const parsed = schema.safeParse(rawSearchParams);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters." },
      { status: 400 },
    );
  }

  return parsed.data;
}

export function parseRouteParams<T>(
  params: Record<string, string | string[] | undefined>,
  schema: ZodType<T>,
) {
  const parsed = schema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid route parameters." },
      { status: 400 },
    );
  }

  return parsed.data;
}

export function rejectNonJsonRequest(request: Request) {
  const contentType = request.headers.get("content-type");

  if (!contentType) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  const normalizedContentType = contentType.toLowerCase();
  if (
    normalizedContentType === "application/json" ||
    normalizedContentType.startsWith("application/json;")
  ) {
    return null;
  }

  return NextResponse.json(
    { error: "Content-Type must be application/json." },
    { status: 415 },
  );
}

export function rejectLargeRequest(request: Request, maxBytes: number) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return NextResponse.json(
      { error: `Request body is too large. Limit is ${maxBytes} bytes.` },
      { status: 413 },
    );
  }

  return null;
}

export function rejectUntrustedOrigin(request: Request) {
  const trustedOrigins = getTrustedOrigins();
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Also trust same-deployment: if the request's own host matches the
  // incoming origin, the browser is on the same deployment (e.g. preview).
  const requestOrigin = new URL(request.url).origin;

  if (origin) {
    if (trustedOrigins.has(origin) || origin === requestOrigin) {
      return null;
    }
    return NextResponse.json(
      { error: "Untrusted request origin." },
      { status: 403 },
    );
  }

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (
        !trustedOrigins.has(refererOrigin) &&
        refererOrigin !== requestOrigin
      ) {
        return NextResponse.json(
          { error: "Untrusted request origin." },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Untrusted request origin." },
        { status: 403 },
      );
    }
  }

  return null;
}
