import { NextResponse } from "next/server";

import { parseRouteParams, parseSearchParams } from "@/server/request-guards";
import {
  emptySearchParamsSchema,
  paymentMethodParamSchema,
  type PaymentMethodParams,
} from "@/server/schemas/request";
import { resolvePaymentRedirect } from "@/server/payments";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ method: string }> },
) {
  const queryParams = parseSearchParams(request, emptySearchParamsSchema);
  if (queryParams instanceof NextResponse) {
    return queryParams;
  }

  const baseUrl = new URL(request.url);
  const rawParams = await context.params;
  const params = parseRouteParams(
    rawParams,
    paymentMethodParamSchema,
  ) as PaymentMethodParams | NextResponse;

  if (params instanceof NextResponse) {
    return params;
  }

  const { method } = params;
  const targetUrl = resolvePaymentRedirect(method);
  if (!targetUrl) {
    return NextResponse.redirect(new URL("/#contact", baseUrl));
  }

  return NextResponse.redirect(targetUrl, {
    status: 302,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
