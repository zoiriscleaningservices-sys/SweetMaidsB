import { NextResponse } from 'next/server';
import { SERVICES, CORE_SERVICES, CITY_PAGES, COMBO_PAGES } from '@/config/site-structure';
import { NESTED_TO_FLAT_COMBOS } from '@/config/redirects';

export async function GET() {
  const baseUrl = 'https://www.sweetmaidcleaning.com';
  const now = new Date().toISOString().split('T')[0];

  const urlSet = new Set<string>();

  // 1. Homepage
  urlSet.add('/');

  // 2. Static pages
  const staticPages = [
    '/about/',
    '/services/',
    '/locations/',
    '/gallery/',
    '/blog/',
    '/book-online/',
    '/terms-and-conditions/',
    '/privacy-policy/',
  ];
  staticPages.forEach(p => urlSet.add(p));

  // 3. 24 Top-level service pages
  SERVICES.forEach(service => {
    urlSet.add(`/${service}/`);
  });

  // 4. 63 City hub pages
  Object.keys(CITY_PAGES).forEach(citySlug => {
    urlSet.add(`/${citySlug}/`);
  });

  // 5. City x 10 Core Services subpages
  Object.keys(CITY_PAGES).forEach(citySlug => {
    CORE_SERVICES.forEach(service => {
      const nestedKey = `${citySlug}/${service}`;
      if (NESTED_TO_FLAT_COMBOS[nestedKey]) {
        // Flat combo is the canonical 200 URL
        urlSet.add(NESTED_TO_FLAT_COMBOS[nestedKey]);
      } else {
        urlSet.add(`/${citySlug}/${service}/`);
      }
    });
  });

  // 6. Flat combo pages in COMBO_PAGES
  Object.values(COMBO_PAGES).forEach(combo => {
    urlSet.add(`/${combo.slug}/`);
  });

  // 7. Bespoke Longboat Key subpages
  urlSet.add('/longboat-key-fl/about/');
  urlSet.add('/longboat-key-fl/gallery/');
  urlSet.add('/longboat-key-fl/blog/');

  // Build clean XML
  const sortedUrls = Array.from(urlSet).sort();
  const xmlEntries = sortedUrls.map(path => {
    let priority = '0.7';
    let changefreq = 'weekly';

    if (path === '/') {
      priority = '1.0';
      changefreq = 'daily';
    } else if (path === '/services/' || path === '/locations/' || path === '/book-online/') {
      priority = '0.9';
      changefreq = 'daily';
    } else if (staticPages.includes(path)) {
      priority = '0.8';
      changefreq = 'monthly';
    } else if (SERVICES.some(s => path === `/${s}/`)) {
      priority = '0.9';
    } else if (Object.keys(CITY_PAGES).some(c => path === `/${c}/`)) {
      priority = '0.8';
    }

    return `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
