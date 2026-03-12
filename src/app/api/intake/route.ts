import { NextResponse } from 'next/server';

import { takeRateLimitHit } from '@/server/rate-limit';
import { intakeSchema } from '@/server/schemas/intake';

export const runtime = 'nodejs';

const INTAKE_LIMIT = 5;
const INTAKE_WINDOW_MS = 60 * 60 * 1_000;

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = intakeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please review the form and try again.' }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const rateLimit = takeRateLimitHit({
    scope: 'intake',
    key: getClientKey(request),
    limit: INTAKE_LIMIT,
    windowMs: INTAKE_WINDOW_MS,
  });

  if (!rateLimit.ok) {
    return NextResponse.json(
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

  if (webhookUrl) {
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
        return NextResponse.json(
          { error: 'We could not submit your request. Please try again.' },
          { status: 502 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'We could not submit your request. Please try again.' },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    success: true,
    queued: Boolean(webhookUrl),
  });
}
