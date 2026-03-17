import { NextResponse } from 'next/server';

import { takeRateLimitHit } from '@/server/rate-limit';
import { intakeSchema } from '@/server/schemas/intake';

export const runtime = 'nodejs';
export const maxDuration = 10;

const INTAKE_LIMIT = 5;
const INTAKE_WINDOW_MS = 60 * 60 * 1_000;
const INTAKE_NOT_CONFIGURED_ERROR =
  'Intake submissions are temporarily unavailable. Please contact the office directly.';

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.INTAKE_WEBHOOK_URL?.trim()),
  });
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

  const rateLimit = await takeRateLimitHit({
    scope: 'intake',
    key: getClientKey(request),
    limit: INTAKE_LIMIT,
    windowMs: INTAKE_WINDOW_MS,
  });

  if (rateLimit.reason) {
    return NextResponse.json(
      {
        error: 'Intake submissions are temporarily unavailable. Please try again later.',
      },
      { status: 503 },
    );
  }

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
  if (!webhookUrl) {
    return NextResponse.json(
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
      return NextResponse.json(
        { error: 'We could not submit your request. Please try again.' },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('Intake webhook request failed:', error);
    return NextResponse.json(
      { error: 'We could not submit your request. Please try again.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    queued: true,
  });
}
