import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.VERCEL_ENV === 'preview' ||
    !process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    !['GET', 'HEAD'].includes(request.method)
  ) {
    return NextResponse.next();
  }

  const canonicalUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL.trim());
  const requestHost = request.headers.get('host');
  const forwardedProto = request.headers.get('x-forwarded-proto');

  const requiresHostRedirect = Boolean(requestHost && requestHost !== canonicalUrl.host);
  const requiresHttpsRedirect =
    canonicalUrl.protocol === 'https:' && Boolean(forwardedProto && forwardedProto !== 'https');

  if (!requiresHostRedirect && !requiresHttpsRedirect) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, canonicalUrl);
  return NextResponse.redirect(redirectUrl, 301);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
