import { NextResponse } from 'next/server';
import { serviceSlugs, getLocationData, getFloridaMasterDb } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shardNum = parseInt(id.replace(/\.xml$/, ''), 10);
  const baseUrl = 'https://sweetmaidcleaning.com';
  const now = new Date().toISOString().split('T')[0];

  if (isNaN(shardNum) || shardNum < 1 || shardNum > 25) {
    return new NextResponse('Sitemap shard not found', { status: 404 });
  }

  const urls: string[] = [];

  // Helper to append URL
  function addUrl(loc: string, priority: string = '0.8', changefreq: string = 'weekly') {
    urls.push(`
  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  const cities = Object.keys(getLocationData());
  const masterDb = getFloridaMasterDb();
  const zipCodes = masterDb?.zip_codes ? Object.keys(masterDb.zip_codes) : [];
  const neighborhoods = masterDb?.neighborhoods ? Object.keys(masterDb.neighborhoods) : [];
  const counties = masterDb?.counties ? Object.keys(masterDb.counties) : [];

  if (shardNum === 1) {
    // Core Site & Services Root
    addUrl('/', '1.0', 'daily');
    addUrl('/locations/', '0.9', 'daily');
    addUrl('/about/', '0.8', 'monthly');
    addUrl('/blog/', '0.8', 'weekly');
    addUrl('/gallery/', '0.8', 'monthly');
    addUrl('/booknow/', '0.9', 'daily');

    serviceSlugs.forEach(service => {
      addUrl(`/${service}/`, '0.9', 'weekly');
    });

    // First 400 Cities × Primary 25 Services
    const slice = cities.slice(0, 400);
    slice.forEach(citySlug => {
      addUrl(`/${citySlug}/`, '0.9', 'weekly');
      serviceSlugs.slice(0, 25).forEach(service => {
        addUrl(`/${citySlug}/${service}/`, '0.8', 'weekly');
      });
    });
  } else if (shardNum === 2) {
    // Remaining Cities × 50 Services
    const slice = cities.slice(400);
    slice.forEach(citySlug => {
      addUrl(`/${citySlug}/`, '0.9', 'weekly');
      serviceSlugs.forEach(service => {
        addUrl(`/${citySlug}/${service}/`, '0.8', 'weekly');
      });
    });
    // First 400 Cities × Remaining 25 Services
    cities.slice(0, 400).forEach(citySlug => {
      serviceSlugs.slice(25).forEach(service => {
        addUrl(`/${citySlug}/${service}/`, '0.8', 'weekly');
      });
    });
  } else if (shardNum >= 3 && shardNum <= 10) {
    // Zip Code Shards (745+ Florida Zip Codes × 50 Services)
    const zipIndex = shardNum - 3;
    const chunkSize = Math.ceil(zipCodes.length / 8);
    const slice = zipCodes.slice(zipIndex * chunkSize, (zipIndex + 1) * chunkSize);

    slice.forEach(zip => {
      addUrl(`/${zip}/`, '0.8', 'weekly');
      serviceSlugs.forEach(service => {
        addUrl(`/${zip}/${service}/`, '0.7', 'weekly');
      });
    });
  } else if (shardNum >= 11 && shardNum <= 20) {
    // Neighborhoods & Luxury Developments (4,000+ communities × 50 Services)
    const nIndex = shardNum - 11;
    const chunkSize = Math.ceil(neighborhoods.length / 10);
    const slice = neighborhoods.slice(nIndex * chunkSize, (nIndex + 1) * chunkSize);

    slice.forEach(nSlug => {
      addUrl(`/${nSlug}/`, '0.8', 'weekly');
      serviceSlugs.forEach(service => {
        addUrl(`/${nSlug}/${service}/`, '0.7', 'weekly');
      });
    });
  } else if (shardNum >= 21 && shardNum <= 25) {
    // Counties (67 Counties × 50 Services) + Cost/Pricing Estimator URLs
    const cIndex = shardNum - 21;
    const chunkSize = Math.ceil(counties.length / 5);
    const slice = counties.slice(cIndex * chunkSize, (cIndex + 1) * chunkSize);

    slice.forEach(cSlug => {
      addUrl(`/${cSlug}/`, '0.8', 'weekly');
      serviceSlugs.forEach(service => {
        addUrl(`/${cSlug}/${service}/`, '0.7', 'weekly');
      });
    });

    // Add sample Pricing & Cost Estimator URLs
    const targetCities = cities.slice(cIndex * 150, (cIndex + 1) * 150);
    targetCities.forEach(city => {
      serviceSlugs.slice(0, 10).forEach(service => {
        addUrl(`/cost/${city}/${service}/`, '0.7', 'monthly');
      });
    });
  }

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
    },
  });
}
