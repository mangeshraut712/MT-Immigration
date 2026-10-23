import { NextResponse } from "next/server";

import { withApiHeaders } from "@/lib/security";
import { getClientKey, parseSearchParams } from "@/server/request-guards";
import { takeRateLimitHit } from "@/server/rate-limit";
import { emptySearchParamsSchema } from "@/server/schemas/request";
import { resolveInsightFeed } from "@/server/insights";

export const runtime = "nodejs";
export const maxDuration = 20;

const INSIGHTS_LIMIT = 12;
const INSIGHTS_WINDOW_MS = 60_000;
function getResponseHeaders() {
  return withApiHeaders({
    "Cache-Control":
      "public, max-age=0, s-maxage=1200, stale-while-revalidate=3600",
  });
}

export async function GET(request: Request) {
  const queryParams = parseSearchParams(request, emptySearchParamsSchema);
  if (queryParams instanceof NextResponse) {
    return queryParams;
  }

  const rateLimit = await takeRateLimitHit({
    scope: "insights",
    key: getClientKey(request),
    limit: INSIGHTS_LIMIT,
    windowMs: INSIGHTS_WINDOW_MS,
  });

  if (rateLimit.reason) {
    return NextResponse.json(
      {
        error: "Insights are temporarily unavailable. Please try again later.",
      },
      { status: 503, headers: withApiHeaders() },
    );
  }

  if (!rateLimit.ok) {
    const headers = getResponseHeaders();
    headers.set(
      "Retry-After",
      String(Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1_000), 1)),
    );
    return NextResponse.json(
      { error: "Too many refreshes. Please wait a minute and try again." },
      {
        status: 429,
        headers,
      },
    );
  }

  const payload = await resolveInsightFeed();
  return NextResponse.json(payload, { headers: getResponseHeaders() });
}
