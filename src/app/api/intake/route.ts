import { NextResponse } from 'next/server';

import {
  getClientKey,
  rejectUnexpectedSearchParams,
  rejectUntrustedOrigin,
} from '@/server/request-guards';
import { takeRateLimitHit } from '@/server/rate-limit';
import { intakeSchema } from '@/server/schemas/intake';

export const runtime = 'nodejs';
export const maxDuration = 10;

const INTAKE_LIMIT = 5;
const INTAKE_WINDOW_MS = 60 * 60 * 1_000;
const INTAKE_STATUS_LIMIT = 30;
const INTAKE_NOT_CONFIGURED_ERROR =
  'Intake submissions are temporarily unavailable. Please contact the office directly.';

function jsonNoStore(body: unknown, init?: (ResponseInit & { headers?: HeadersInit }) | undefined) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init?.headers ?? {}),
    },
  });
}

export async function GET(request: Request) {
  const queryError = rejectUnexpectedSearchParams(request);
  if (queryError) {
    return queryError;
  }

  const rateLimit = await takeRateLimitHit({
    scope: 'intake-status',
    key: getClientKey(request),
    limit: INTAKE_STATUS_LIMIT,
    windowMs: INTAKE_WINDOW_MS,
  });

  if (rateLimit.reason) {
    return jsonNoStore(
      { error: 'Intake status is temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  if (!rateLimit.ok) {
    return jsonNoStore(
      { error: 'Too many status checks. Please wait and try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1_000), 1),
          ),
        },
      },
    );
  }

  return jsonNoStore({
    ok: true,
    configured: Boolean(process.env.INTAKE_WEBHOOK_URL?.trim()),
  });
}

export async function POST(request: Request) {
  const queryError = rejectUnexpectedSearchParams(request);
  if (queryError) {
    return queryError;
  }

  const originError = rejectUntrustedOrigin(request);
  if (originError) {
    return originError;
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonNoStore({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = intakeSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonNoStore({ error: 'Please review the form and try again.' }, { status: 400 });
  }

  if (parsed.data.website) {
    return jsonNoStore({ success: true }, { status: 200 });
  }

  const rateLimit = await takeRateLimitHit({
    scope: 'intake',
    key: getClientKey(request),
    limit: INTAKE_LIMIT,
    windowMs: INTAKE_WINDOW_MS,
  });

  if (rateLimit.reason) {
    return jsonNoStore(
      {
        error: 'Intake submissions are temporarily unavailable. Please try again later.',
      },
      { status: 503 },
    );
  }

  if (!rateLimit.ok) {
    return jsonNoStore(
      {
        error: 'Too many intake submissions. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1_000), 1),
          ),
        },
      },
    );
  }

  const webhookUrl = process.env.INTAKE_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return jsonNoStore(
      {
        error: INTAKE_NOT_CONFIGURED_ERROR,
      },
      { status: 503 },
    );
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submittedAt: new Date().toISOString(),
        source: 'mt-immigration-website',
        intake: {
          ...parsed.data,
          website: undefined,
        },
      }),
      signal: AbortSignal.timeout(8_000),
      cache: 'no-store',
    });

    if (!webhookResponse.ok) {
      console.error('Intake webhook rejected submission:', {
        status: webhookResponse.status,
      });
      return jsonNoStore(
        { error: 'We could not submit your request. Please try again.' },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('Intake webhook request failed:', error);
    return jsonNoStore(
      { error: 'We could not submit your request. Please try again.' },
      { status: 502 },
    );
  }

  return jsonNoStore({
    success: true,
    queued: true,
  });
}
