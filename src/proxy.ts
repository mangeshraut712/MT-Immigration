import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create the i18n middleware
const i18nMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  // First, handle i18n routing
  const i18nResponse = i18nMiddleware(request);

  // If i18n middleware returns a redirect, follow it
  if (i18nResponse.status === 307 || i18nResponse.status === 308) {
    return i18nResponse;
  }

  // Then handle canonical URL proxy logic
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.VERCEL_ENV === 'preview' ||
    !process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    !['GET', 'HEAD'].includes(request.method)
  ) {
    return i18nResponse;
  }

  const canonicalUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL.trim());
  const requestHost = request.headers.get('host');
  const forwardedProto = request.headers.get('x-forwarded-proto');

  const requiresHostRedirect = Boolean(requestHost && requestHost !== canonicalUrl.host);
  const requiresHttpsRedirect =
    canonicalUrl.protocol === 'https:' && Boolean(forwardedProto && forwardedProto !== 'https');

  if (!requiresHostRedirect && !requiresHttpsRedirect) {
    return i18nResponse;
  }

  const redirectUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, canonicalUrl);
  const redirectResponse = NextResponse.redirect(redirectUrl, 301);

  i18nResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'location') {
      return;
    }

    redirectResponse.headers.set(key, value);
  });

  return redirectResponse;
}

export const config = {
  // Match only internationalized pathnames and proxy routes
  matcher: ['/((?!api|pay|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
