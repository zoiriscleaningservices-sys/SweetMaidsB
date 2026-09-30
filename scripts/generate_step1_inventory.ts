import fs from 'fs';
import path from 'path';
import http from 'http';
import { CITY_PAGES, REGIONS, SERVICES, CORE_SERVICES, COMBO_PAGES, SITE_PAGES, BLOG_POSTS, getRegionForCity, resolveFlatCombo } from '../src/config/site-structure';

interface PageAudit {
  url: string;
  type: string;
  slug: string;
  city?: string;
  county?: string;
  region?: string;
  status: number;
  title: string;
  titleLength: number;
  h1: string;
  h1Count: number;
  headings: { tag: string; text: string }[];
  meta: string;
  metaLength: number;
  wordCount: number;
  internalLinks: string[];
  bannedPhrases: string[];
  templateErrors: string[];
}

const BANNED_PATTERNS = [
  /#1\b/i,
  /\btop-rated\b/i,
  /\bbest\b/i,
  /\bleading provider\b/i,
  /\bpremier\b/i,
  /\bmost trusted\b/i,
  /\b24\/7\b/i,
  /14651\s*Westbrook/i,
  /\b34211\b/i,
];

function fetchPage(urlPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractHeadings(html: string): { h1Count: number; headings: { tag: string; text: string }[] } {
  const headings: { tag: string; text: string }[] = [];
  const matches = [...html.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)];
  let h1Count = 0;
  for (const m of matches) {
    const tag = m[1].toLowerCase();
    const text = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (tag === 'h1') h1Count++;
    headings.push({ tag, text });
  }
  return { h1Count, headings };
}

function extractWordCount(html: string): number {
  let body = html;
  body = body.replace(/<header[\s\S]*?<\/header>/gi, '');
  body = body.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  body = body.replace(/<div id="mobile-menu"[\s\S]*?<\/div>\s*<\/div>/gi, '');
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
  body = body.replace(/<style[\s\S]*?<\/style>/gi, '');
  body = body.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  body = body.replace(/<[^>]+>/g, ' ');
  const words = body.replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0);
  return words.length;
}

function extractInternalLinks(html: string): string[] {
  const links: string[] = [];
  const matches = [...html.matchAll(/href=["']([^"']+)["']/gi)];
  for (const m of matches) {
    let href = m[1].trim();
    if (href.startsWith('https://www.sweetmaidcleaning.com')) {
      href = href.replace('https://www.sweetmaidcleaning.com', '');
    }
    if (href.startsWith('/') && !href.startsWith('/_next') && !href.startsWith('/images') && !href.startsWith('/js') && !href.startsWith('/icon')) {
      links.push(href.split('#')[0].split('?')[0]);
    }
  }
  return [...new Set(links)];
}

function findBannedPhrases(text: string): string[] {
  const found: string[] = [];
  for (const pat of BANNED_PATTERNS) {
    if (pat.test(text)) {
      found.push(pat.source);
    }
  }
  return found;
}

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function findTemplateErrors(html: string): string[] {
  const errors: string[] = [];
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '');
  if (visible.includes('undefined')) errors.push('literal "undefined" in page');
  if (/\bnull\b/.test(visible)) errors.push('literal "null" in text');
  if (visible.includes('[object Object]')) errors.push('[object Object] in text');
  if (/\b(?:the the|in in|for for|and and|of of)\b/i.test(visible)) errors.push('doubled common word (e.g. "the the", "in in")');
  if (/\{\{[^}]+\}\}/.test(visible)) errors.push('unresolved handlebars template tag');
  return errors;
}

async function runAudit() {
  console.log('🚀 Starting Comprehensive Step 1 Site & Locations Audit...');

  const citySlugs = Object.keys(CITY_PAGES);
  console.log(`Found ${citySlugs.length} locations in CITY_PAGES.`);

  // 1. Audit all 230 location pages
  const locationAudits: PageAudit[] = [];
  const concurrency = 10;
  
  for (let i = 0; i < citySlugs.length; i += concurrency) {
    const chunk = citySlugs.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async (slug) => {
        const cp = CITY_PAGES[slug];
        const reg = getRegionForCity(slug);
        const url = `/${slug}/`;
        try {
          const html = await fetchPage(url);
          const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          const metaMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
          const { h1Count, headings } = extractHeadings(html);
          const h1 = headings.find(h => h.tag === 'h1')?.text || '';
          const wordCount = extractWordCount(html);
          const titleRaw = titleMatch ? titleMatch[1].trim() : '';
          const metaRaw = metaMatch ? metaMatch[1].trim() : '';
          const title = decodeHtml(titleRaw);
          const meta = decodeHtml(metaRaw);
          const banned = findBannedPhrases(html);
          const templateErrs = findTemplateErrors(html);
          const internalLinks = extractInternalLinks(html);

          return {
            url,
            type: 'location',
            slug,
            city: cp.name,
            county: cp.county,
            region: reg?.name || cp.county,
            status: 200,
            title,
            titleLength: title.length,
            h1,
            h1Count,
            headings,
            meta,
            metaLength: meta.length,
            wordCount,
            internalLinks,
            bannedPhrases: banned,
            templateErrors: templateErrs
          };
        } catch (e: any) {
          return {
            url,
            type: 'location',
            slug,
            city: cp.name,
            county: cp.county,
            region: reg?.name || cp.county,
            status: 500,
            title: '',
            titleLength: 0,
            h1: '',
            h1Count: 0,
            headings: [],
            meta: '',
            metaLength: 0,
            wordCount: 0,
            internalLinks: [],
            bannedPhrases: [],
            templateErrors: [e.message]
          };
        }
      })
    );
    locationAudits.push(...chunkResults);
    process.stdout.write(`Processed ${locationAudits.length}/${citySlugs.length} locations...\r`);
  }
  console.log(`\n✅ Finished auditing all ${locationAudits.length} location pages.`);

  // 2. Audit Other Pages
  const otherPagesToAudit = [
    { url: '/', type: 'homepage' },
    { url: '/services/', type: 'services_index' },
    { url: '/locations/', type: 'locations_index' },
    { url: '/about/', type: 'about' },
    { url: '/blog/', type: 'blog_index' },
    { url: '/gallery/', type: 'gallery' },
    { url: '/book-online/', type: 'booking' },
    { url: '/privacy-policy/', type: 'legal' },
    { url: '/terms-and-conditions/', type: 'legal' },
    { url: '/login/', type: 'login' },
    // 6 blog posts
    ...BLOG_POSTS.map(b => ({ url: b.path, type: 'blog_post' })),
    // 24 statewide service pages
    ...SERVICES.map(s => ({ url: `/${s}/`, type: 'service' })),
    // Sample combos
    ...Object.values(COMBO_PAGES).slice(0, 20).map(c => ({ url: `/${c.slug}/`, type: 'service_location_combo' }))
  ];

  console.log(`Auditing ${otherPagesToAudit.length} site, service, and blog pages...`);
  const otherAudits: PageAudit[] = [];
  for (const p of otherPagesToAudit) {
    try {
      const html = await fetchPage(p.url);
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const metaMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
      const { h1Count, headings } = extractHeadings(html);
      const h1 = headings.find(h => h.tag === 'h1')?.text || '';
      const wordCount = extractWordCount(html);
      const titleRaw = titleMatch ? titleMatch[1].trim() : '';
      const metaRaw = metaMatch ? metaMatch[1].trim() : '';
      const title = decodeHtml(titleRaw);
      const meta = decodeHtml(metaRaw);
      const banned = findBannedPhrases(html);
      const templateErrs = findTemplateErrors(html);
      const internalLinks = extractInternalLinks(html);

      otherAudits.push({
        url: p.url,
        type: p.type,
        slug: p.url.replace(/^\/|\/$/g, ''),
        status: 200,
        title,
        titleLength: title.length,
        h1,
        h1Count,
        headings,
        meta,
        metaLength: meta.length,
        wordCount,
        internalLinks,
        bannedPhrases: banned,
        templateErrors: templateErrs
      });
    } catch (e: any) {
      otherAudits.push({
        url: p.url,
        type: p.type,
        slug: p.url.replace(/^\/|\/$/g, ''),
        status: 500,
        title: '',
        titleLength: 0,
        h1: '',
        h1Count: 0,
        headings: [],
        meta: '',
        metaLength: 0,
        wordCount: 0,
        internalLinks: [],
        bannedPhrases: [],
        templateErrors: [e.message]
      });
    }
  }

  // 3. Build locations_inventory.csv
  // Required columns: slug,city,county,region,current_title,current_h1,word_count
  const csvRows: string[] = ['slug,city,county,region,current_title,current_h1,word_count'];
  for (const a of locationAudits) {
    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
    csvRows.push([
      escapeCsv(a.slug),
      escapeCsv(a.city || ''),
      escapeCsv(a.county || ''),
      escapeCsv(a.region || ''),
      escapeCsv(a.title),
      escapeCsv(a.h1),
      a.wordCount
    ].join(','));
  }
  const csvPath = path.join(process.cwd(), 'locations_inventory.csv');
  fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
  console.log(`✅ Written locations_inventory.csv (${csvRows.length - 1} location rows)`);

  // 4. Analyze Duplicates across all audited pages
  const allAudits = [...locationAudits, ...otherAudits];

  const titleMap = new Map<string, string[]>();
  const h1Map = new Map<string, string[]>();
  const metaMap = new Map<string, string[]>();

  for (const a of allAudits) {
    if (a.title) {
      const arr = titleMap.get(a.title) || [];
      arr.push(a.url);
      titleMap.set(a.title, arr);
    }
    if (a.h1) {
      const arr = h1Map.get(a.h1) || [];
      arr.push(a.url);
      h1Map.set(a.h1, arr);
    }
    if (a.meta) {
      const arr = metaMap.get(a.meta) || [];
      arr.push(a.url);
      metaMap.set(a.meta, arr);
    }
  }

  const duplicateTitles = Array.from(titleMap.entries()).filter(([_, urls]) => urls.length > 1);
  const duplicateH1s = Array.from(h1Map.entries()).filter(([_, urls]) => urls.length > 1);
  const duplicateMetas = Array.from(metaMap.entries()).filter(([_, urls]) => urls.length > 1);

  // 5. Check broken links
  const allKnownUrls = new Set([
    ...allAudits.map(a => a.url),
    ...Object.keys(CITY_PAGES).map(c => `/${c}/`),
    ...SERVICES.map(s => `/${s}/`),
    ...Object.values(COMBO_PAGES).map(c => `/${c.slug}/`),
    '/', '/services/', '/locations/', '/about/', '/blog/', '/gallery/', '/book-online/',
    '/privacy-policy/', '/terms-and-conditions/'
  ]);

  const brokenLinksFound: { fromUrl: string; toUrl: string }[] = [];
  for (const a of allAudits) {
    for (const link of a.internalLinks) {
      const cleanSlug = link.replace(/^\/|\/$/g, '');
      const isKnown = allKnownUrls.has(link) ||
        allKnownUrls.has(link + '/') ||
        !!resolveFlatCombo(cleanSlug) ||
        link === '/llms.txt' ||
        link === '/sitemap.xml' ||
        link.endsWith('.xml') ||
        link.endsWith('.txt');
      if (!isKnown && !link.startsWith('/tel:') && !link.startsWith('/mailto:')) {
        brokenLinksFound.push({ fromUrl: a.url, toUrl: link });
      }
    }
  }

  // 6. Save comprehensive summary JSON
  const summaryReport = {
    timestamp: new Date().toISOString(),
    totalLocations: locationAudits.length,
    totalOtherPagesAudited: otherAudits.length,
    duplicateTitlesCount: duplicateTitles.length,
    duplicateTitles: duplicateTitles.map(([title, urls]) => ({ title, count: urls.length, sampleUrls: urls.slice(0, 5) })),
    duplicateH1sCount: duplicateH1s.length,
    duplicateH1s: duplicateH1s.map(([h1, urls]) => ({ h1, count: urls.length, sampleUrls: urls.slice(0, 5) })),
    duplicateMetasCount: duplicateMetas.length,
    duplicateMetas: duplicateMetas.map(([meta, urls]) => ({ meta, count: urls.length, sampleUrls: urls.slice(0, 5) })),
    titleLengthOutsideRange: allAudits.filter(a => a.titleLength < 30 || a.titleLength > 65).map(a => ({ url: a.url, title: a.title, length: a.titleLength })),
    titleLengthOutsideOptimal: allAudits.filter(a => a.titleLength < 50 || a.titleLength > 60).map(a => ({ url: a.url, title: a.title, length: a.titleLength })),
    metaLengthOutsideRange: allAudits.filter(a => a.metaLength < 120 || a.metaLength > 320).map(a => ({ url: a.url, meta: a.meta, length: a.metaLength })),
    metaLengthOutsideOptimal: allAudits.filter(a => a.metaLength < 140 || a.metaLength > 160).map(a => ({ url: a.url, meta: a.meta, length: a.metaLength })),
    pagesWithBannedPhrases: allAudits.filter(a => a.bannedPhrases.length > 0).map(a => ({ url: a.url, phrases: a.bannedPhrases })),
    pagesWithTemplateErrors: allAudits.filter(a => a.templateErrors.length > 0).map(a => ({ url: a.url, errors: a.templateErrors })),
    brokenLinksSample: brokenLinksFound.slice(0, 50),
    sampleLocations: locationAudits.slice(0, 5)
  };

  fs.writeFileSync(path.join(process.cwd(), 'audit_summary_step1.json'), JSON.stringify(summaryReport, null, 2), 'utf8');
  console.log('✅ Written audit_summary_step1.json');
  console.log('\n--- AUDIT SUMMARY HIGHLIGHTS ---');
  console.log(`Total Locations Audited: ${locationAudits.length}`);
  console.log(`Duplicate Title Sets: ${duplicateTitles.length}`);
  console.log(`Duplicate H1 Sets: ${duplicateH1s.length}`);
  console.log(`Duplicate Meta Sets: ${duplicateMetas.length}`);
  console.log(`Pages with Title outside 30-65 chars: ${summaryReport.titleLengthOutsideRange.length}`);
  console.log(`Pages with Title outside 50-60 target: ${summaryReport.titleLengthOutsideOptimal.length}`);
  console.log(`Pages with Meta outside 120-320 chars: ${summaryReport.metaLengthOutsideRange.length}`);
  console.log(`Pages with Meta outside 140-160 target: ${summaryReport.metaLengthOutsideOptimal.length}`);
  console.log(`Pages with Banned Phrases: ${summaryReport.pagesWithBannedPhrases.length}`);
  console.log(`Pages with Template Errors: ${summaryReport.pagesWithTemplateErrors.length}`);
  console.log(`Broken Links Detected: ${brokenLinksFound.length}`);
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
