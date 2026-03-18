import { NextResponse } from 'next/server';

function getCanonicalHost() {
  // On non-production Vercel deploys, skip canonical-host enforcement
  // so preview URLs remain usable for QA.
  if (process.env.VERCEL && process.env.VERCEL_ENV !== 'production') {
    return null;
  }

  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (!configuredSiteUrl) {
    return null;
  }

  const normalizedUrl = configuredSiteUrl.startsWith('http')
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`;

  try {
    return new URL(normalizedUrl).host;
  } catch {
    return null;
  }
}

export function middleware(request) {
  const host = request.headers.get('host') || request.nextUrl.host;
  const protocol = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');
  const canonicalHost = getCanonicalHost();

  // Strip www. regardless of deployment type
  if (host.startsWith('www.')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.host = host.replace(/^www\./, '');
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Enforce HTTPS only on the canonical production host
  if (
    canonicalHost &&
    protocol === 'http' &&
    host === canonicalHost &&
    !host.includes('localhost')
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = 'https';
    return NextResponse.redirect(redirectUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

