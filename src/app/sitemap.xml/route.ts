import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = "https://sweetmaidcleaning.com";
  const now = new Date().toISOString();

  // 50 Dynamic Shards representing the 1,000,000+ Florida SEO Network
  const totalShards = 50;
  let sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (let i = 1; i <= totalShards; i++) {
    sitemapIndexXml += `
  <sitemap>
    <loc>${baseUrl}/sitemap/${i}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
  }

  sitemapIndexXml += `
</sitemapindex>`;

  return new NextResponse(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
