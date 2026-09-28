import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('410 Gone - Sitemap shards have been decommissioned and consolidated into /sitemap.xml.', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, gone',
      'Cache-Control': 'public, max-age=604800, s-maxage=2592000, immutable',
    },
  });
}
