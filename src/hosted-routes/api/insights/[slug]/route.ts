import { NextResponse } from "next/server";

import { parseRouteParams, parseSearchParams } from "@/server/request-guards";
import { resolveInsightArticleBySlug } from "@/server/insights";
import {
  emptySearchParamsSchema,
  insightSlugParamSchema,
} from "@/server/schemas/request";

export const runtime = "nodejs";
export const maxDuration = 20;

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const queryParams = parseSearchParams(request, emptySearchParamsSchema);
  if (queryParams instanceof NextResponse) {
    return queryParams;
  }

  const rawParams = await context.params;
  const params = parseRouteParams(rawParams, insightSlugParamSchema);
  if (params instanceof NextResponse) {
    return params;
  }

  const { slug } = params;
  const article = await resolveInsightArticleBySlug(slug);
  if (!article) {
    return NextResponse.json(
      { error: "Knowledge Hub entry not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(article, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
