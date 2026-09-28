import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveRedirect } from '@/config/redirects';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname, search } = request.nextUrl;

  // 1. Host canonicalization: apex -> www (308 Permanent Redirect)
  if (host === 'sweetmaidcleaning.com') {
    const target = new URL(`https://www.sweetmaidcleaning.com${pathname}${search}`);
    return NextResponse.redirect(target, 308);
  }

  // 2. Trailing slash and dynamic path redirects (301 Moved Permanently)
  const redirectTarget = resolveRedirect(pathname);
  if (redirectTarget && redirectTarget !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = redirectTarget;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public files ending with static file extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)',
  ],
};
