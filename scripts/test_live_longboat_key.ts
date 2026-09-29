import { longboatKeyPages } from '../src/lib/longboat_key_content';
import { DECOMMISSIONED_SERVICES } from '../src/config/redirects';

async function run() {
  const host = process.argv[2] || 'https://www.sweetmaidcleaning.com';
  console.log(`Testing all 53 Longboat Key pages on ${host}...`);

  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const [key, page] of Object.entries(longboatKeyPages)) {
    const url = `${host}${page.route}`;
    const decommissionedTarget = DECOMMISSIONED_SERVICES[key];

    try {
      if (decommissionedTarget) {
        // Decommissioned service: must redirect (301) to canonical equivalent
        const redirectRes = await fetch(url, { redirect: 'manual' });
        const expectedLoc = `/longboat-key-fl/${decommissionedTarget}/`;
        const actualLoc = redirectRes.headers.get('location');
        if (redirectRes.status !== 301 || actualLoc !== expectedLoc) {
          errors.push(`[DECOMMISSIONED REDIRECT FAIL] ${url}\n  Expected: 301 to "${expectedLoc}"\n  Got:      ${redirectRes.status} to "${actualLoc}"`);
          failed++;
        } else {
          passed++;
        }
        continue;
      }

      const res = await fetch(url);
      if (res.status !== 200) {
        errors.push(`[HTTP ${res.status}] ${url}`);
        failed++;
        continue;
      }

      const html = await res.text();

      // 1. Check <title>
      const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
      const titleText = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim() : '';
      if (titleText !== page.title) {
        errors.push(`[TITLE MISMATCH] ${url}\n  Expected: "${page.title}"\n  Got:      "${titleText}"`);
      }

      // 2. Check <meta name="description">
      const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
      const metaDesc = metaMatch ? metaMatch[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim() : '';
      if (metaDesc !== page.metaDescription) {
        errors.push(`[META MISMATCH] ${url}\n  Expected: "${page.metaDescription}"\n  Got:      "${metaDesc}"`);
      }

      // 3. Check NO meta keywords
      if (html.includes('<meta name="keywords"')) {
        errors.push(`[META KEYWORDS FOUND] ${url} contains meta keywords tag!`);
      }

      // 4. Check canonical
      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
      const canonicalHref = canonicalMatch ? canonicalMatch[1] : '';
      const expectedCanonical = `https://www.sweetmaidcleaning.com${page.route}`;
      if (canonicalHref !== expectedCanonical) {
        errors.push(`[CANONICAL MISMATCH] ${url}\n  Expected: "${expectedCanonical}"\n  Got:      "${canonicalHref}"`);
      }

      // 5. Check exactly ONE <h1>
      const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
      if (h1Matches.length !== 1) {
        errors.push(`[H1 COUNT != 1] ${url} has ${h1Matches.length} H1 tags!`);
      } else {
        const h1Content = h1Matches[0].replace(/<[^>]+>/g, '').trim();
        if (h1Content !== page.h1) {
          errors.push(`[H1 TEXT MISMATCH] ${url}\n  Expected: "${page.h1}"\n  Got:      "${h1Content}"`);
        }
      }

      // 6. Check Schema
      const schemaScripts = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi) || [];
      if (schemaScripts.length === 0) {
        errors.push(`[SCHEMA MISSING] ${url} has no JSON-LD schema!`);
      } else {
        let hasAggregateRating = false;
        let hasStreetAddress = false;
        schemaScripts.forEach(s => {
          if (s.includes('"aggregateRating"') || s.includes('"AggregateRating"')) {
            hasAggregateRating = true;
          }
          if (s.includes('"streetAddress"')) {
            hasStreetAddress = true;
          }
        });
        if (hasAggregateRating) {
          errors.push(`[SCHEMA FORBIDDEN] ${url} contains aggregateRating!`);
        }
        if (hasStreetAddress) {
          errors.push(`[SCHEMA FORBIDDEN] ${url} contains streetAddress!`);
        }
      }

      // 7. Check Prohibited phrases in body text (stripping tags, scripts, and styles)
      const cleanBody = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<svg[\s\S]*?<\/svg>/gi, '')
        .replace(/<[^>]+>/g, ' ');

      if (/#1\s+Rated|No\.\s*1\s+Rated/i.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "#1 Rated" found on ${url}`);
      }
      if (/\bBest\b/.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "Best" found on ${url}`);
      }
      if (/leading\s+provider/i.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "leading provider" found on ${url}`);
      }
      if (/\bpremier\b/i.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "premier" found on ${url}`);
      }
      if (/top[- ]rated/i.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "top-rated" found on ${url}`);
      }
      if (/24\/7/i.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "24/7" found on ${url}`);
      }
      if (/Sweet\s*Mind/i.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "Sweet Mind" found on ${url}`);
      }
      if (/Southwest\s+Florida/i.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "Southwest Florida" found on ${url}`);
      }
      if (/Westbrook/i.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "Westbrook" found on ${url}`);
      }
      if (/From\s+the\s+beaches\s+to\s+the\s+ranch/i.test(cleanBody)) {
        errors.push(`[PROHIBITED TEXT] "From the beaches to the ranch" found on ${url}`);
      }

      passed++;
    } catch (e: any) {
      errors.push(`[FETCH ERROR] ${url}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n================================`);
  console.log(`TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`Total Errors: ${errors.length}`);
  console.log(`================================\n`);

  if (errors.length > 0) {
    console.error('Errors encountered:');
    errors.slice(0, 30).forEach(e => console.error(e));
    if (errors.length > 30) {
      console.error(`... and ${errors.length - 30} more errors`);
    }
    process.exit(1);
  } else {
    console.log('ALL 53 PAGES RETURNED 200 AND PASSED ALL CONSTRAINTS PERFECTLY!');
  }
}

run();
