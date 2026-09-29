import fs from 'fs';
import path from 'path';
import { CANONICAL_HOST, PRICING_FROM, SERVICES, CORE_SERVICES, CITY_PAGES } from '../src/config/site-structure';
import { localizedReplace } from '../src/lib/template';

let errorCount = 0;

function reportError(check: string, message: string) {
  console.error(`❌ [FAIL] ${check}: ${message}`);
  errorCount++;
}

function reportPass(check: string, message: string) {
  console.log(`✅ [PASS] ${check}: ${message}`);
}

console.log('====================================================');
console.log('SWEET MAID CLEANING SERVICE - STRUCTURE VERIFICATION');
console.log('====================================================\n');

// 1. Robots.txt Validation
try {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    reportError('Robots.txt', 'public/robots.txt does not exist');
  } else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    if (robotsContent.includes('Disallow: /_next/static/') || robotsContent.includes('Disallow: /_next/')) {
      reportError('Robots.txt', 'robots.txt incorrectly disallows /_next/static/');
    } else {
      reportPass('Robots.txt', 'No /_next/static/ block present');
    }

    if (!/sitemap:\s*https:\/\/www\.sweetmaidcleaning\.com\/sitemap\.xml/i.test(robotsContent)) {
      reportError('Robots.txt', 'robots.txt sitemap directive does not point to www sitemap');
    } else {
      reportPass('Robots.txt', 'Points to https://www.sweetmaidcleaning.com/sitemap.xml');
    }
  }
} catch (e: any) {
  reportError('Robots.txt', e.message);
}

// 2. Homepage Lock Validation
try {
  const homePath = path.join(process.cwd(), 'src', 'app', 'page.tsx');
  const homeContent = fs.readFileSync(homePath, 'utf8');
  
  const expectedTitle = 'Professional Cleaning Services Across Florida | Sweet Maid';
  const expectedH1 = 'Professional Cleaning Services Across Florida';

  if (!homeContent.includes(expectedTitle)) {
    reportError('Homepage Lock', `Title must be exactly: "${expectedTitle}"`);
  } else {
    reportPass('Homepage Lock', 'Title matches exact locked title');
  }

  const rawHome = fs.readFileSync(path.join(process.cwd(), 'templates', 'home', 'index.html'), 'utf8');
  const renderedHome = localizedReplace(rawHome, 'Florida', 'home', false, 'house-cleaning');

  if (!renderedHome.includes(expectedH1)) {
    reportError('Homepage Lock', `Rendered H1 must be exactly: "${expectedH1}"`);
  } else {
    reportPass('Homepage Lock', 'Rendered H1 matches exact locked H1');
  }

  if (homeContent.includes('14651 Westbrook') || homeContent.includes('34211')) {
    reportError('Homepage Lock', 'Homepage still contains Westbrook Cir or 34211');
  } else {
    reportPass('Homepage Lock', 'Westbrook address and 34211 removed from homepage');
  }
} catch (e: any) {
  reportError('Homepage Lock', e.message);
}

// 3. Site Structure Config Validation
try {
  if (CANONICAL_HOST !== 'https://www.sweetmaidcleaning.com') {
    reportError('Site Config', `CANONICAL_HOST must be https://www.sweetmaidcleaning.com, found ${CANONICAL_HOST}`);
  } else {
    reportPass('Site Config', 'CANONICAL_HOST is https://www.sweetmaidcleaning.com');
  }

  if (SERVICES.length !== 24) {
    reportError('Site Config', `Expected 24 approved services, found ${SERVICES.length}`);
  } else {
    reportPass('Site Config', '24 approved services present');
  }

  if (CORE_SERVICES.length !== 10) {
    reportError('Site Config', `Expected 10 core services, found ${CORE_SERVICES.length}`);
  } else {
    reportPass('Site Config', '10 core services present');
  }

  const cityCount = Object.keys(CITY_PAGES).length;
  if (cityCount > 300) {
    reportError('Site Config', `City pages count (${cityCount}) exceeds 300 cap`);
  } else {
    reportPass('Site Config', `City pages count (${cityCount}) is under 300 cap (229 approved cities)`);
  }

  // Pricing verification
  if (PRICING_FROM.standard_cleaning !== 180 || PRICING_FROM.deep_clean !== 250 || PRICING_FROM.move_out !== 350 || PRICING_FROM.office_workplace !== 200) {
    reportError('Pricing SSOT', 'PRICING_FROM does not match pricing.json single source of truth');
  } else {
    reportPass('Pricing SSOT', 'PRICING_FROM matches pricing.json ($180, $250, $350, $200)');
  }
} catch (e: any) {
  reportError('Site Config', e.message);
}

// 4. Source Files Scan for Banned Content
const bannedPatterns: { name: string; pattern: RegExp; exemptFiles?: RegExp }[] = [
  { name: 'Westbrook Address', pattern: /14651\s+Westbrook/i, exemptFiles: /test_live|verify_structure|template\.ts|longboat_key_renderer\.ts/ },
  { name: 'Fake Zip 34211', pattern: /\b34211\b/, exemptFiles: /test_live|verify_structure|template\.ts|longboat_key_renderer\.ts/ },
  { name: '#1 Superlative', pattern: /#1\s+(Rated|Cleaning|Maid|Service)/i, exemptFiles: /verify_structure|template\.ts/ },
  { name: 'Top-Rated Marketing Claim', pattern: /Top-Rated\s+(Cleaning|Maid|Service|House|Cleaner|Professional)/i, exemptFiles: /verify_structure|template\.ts/ },
  { name: 'Banned Premier Superlative', pattern: /\bpremier\s+(cleaning|maid|provider|service|statewide)/i, exemptFiles: /verify_structure|template\.ts/ },
  { name: 'Banned 24/7 Claim', pattern: /\b24\/7\s+(Emergency|Service|Cleaning)/i, exemptFiles: /verify_structure/ },
  { name: 'Banned Guarantee Claim', pattern: /(100%\s+satisfaction\s+guaranteed|100%\s+Sparkle\s+Guarantee)/i, exemptFiles: /verify_structure/ },
  { name: 'Banned Insured/Bonded Claim', pattern: /(licensed,\s+bonded,\s+and\s+insured|multi-million\s+dollar\s+insured)/i, exemptFiles: /verify_structure/ },
  { name: 'Banned 799+ Cities Claim', pattern: /799\+\s*(cities|locations)?/i, exemptFiles: /verify_structure|data\.ts|template\.ts/ },
  { name: 'Banned 5,000+ Homes Claim', pattern: /5,000\+\s*(homes|houses|cleans)/i, exemptFiles: /verify_structure/ },
  { name: 'Banned Sweet Mind Typos', pattern: /\bSweet\s+Mind\b/i, exemptFiles: /verify_structure|template\.ts|longboat_key_renderer\.ts/ },
  { name: 'Banned Beach-to-Ranch Slogan', pattern: /From\s+the\s+beaches\s+to\s+the\s+ranch/i, exemptFiles: /verify_structure|template\.ts|longboat_key_renderer\.ts/ },
  { name: 'Template Bug deep deep', pattern: /\bdeep\s+deep\b/i, exemptFiles: /verify_structure|seo_engine\.ts|template\.ts/ },
  { name: 'Template Stubs', pattern: /(\[VERIFY|TODO|{{\s*service)/i, exemptFiles: /verify_structure/ },
  { name: 'Outdated Banned Price $129', pattern: /\$129\b/, exemptFiles: /verify_structure/ },
  { name: 'Outdated Banned Price $149', pattern: /\$149\b/, exemptFiles: /verify_structure/ },
  { name: 'Outdated Banned Price $199', pattern: /\$199\b/, exemptFiles: /verify_structure/ },
  { name: 'Outdated Banned Price $219', pattern: /\$219\b/, exemptFiles: /verify_structure/ }
];


function checkDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        checkDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?|html)$/.test(entry.name)) {
      const relPath = path.relative(process.cwd(), fullPath);
      const content = fs.readFileSync(fullPath, 'utf8');

      for (const rule of bannedPatterns) {
        if (rule.exemptFiles && rule.exemptFiles.test(relPath)) continue;
        if (rule.pattern.test(content)) {
          reportError(rule.name, `Found violation in ${relPath}`);
        }
      }
    }
  }
}

try {
  checkDirectory(path.join(process.cwd(), 'src'));
  checkDirectory(path.join(process.cwd(), 'templates'));
  reportPass('Source Scan', 'Completed scan across src/ and templates/');
} catch (e: any) {
  reportError('Source Scan', e.message);
}

// 5. Rendered Page Verification (localizedReplace check)
try {
  const rawHtml = fs.readFileSync(path.join(process.cwd(), 'templates', 'home', 'index.html'), 'utf8');
  const sampleRender = localizedReplace(rawHtml, 'Sarasota', 'sarasota-fl', true, 'deep-cleaning');


  if (sampleRender.includes('<!-- LATERAL SEO CROSS-LINKS -->')) {
    reportError('Render Test', 'Rendered template still contains lateral cross-links bar');
  } else {
    reportPass('Render Test', 'Lateral cross-links bar successfully removed');
  }

  if (sampleRender.includes('Popular Daily Searches Matrix') || sampleRender.includes('dailySearchHeading')) {
    reportError('Render Test', 'Rendered template still contains daily searches keyword matrix');
  } else {
    reportPass('Render Test', 'Daily searches keyword matrix successfully removed');
  }

  if (sampleRender.includes('14651 Westbrook') || sampleRender.includes('34211')) {
    reportError('Render Test', 'Rendered template still contains Westbrook or 34211');
  } else {
    reportPass('Render Test', 'Rendered template is clean of Westbrook address');
  }

  if (sampleRender.includes('licensed, bonded, and insured')) {
    reportError('Render Test', 'Rendered template still contains unconfirmed licensed/bonded claim');
  } else {
    reportPass('Render Test', 'Rendered template is clean of banned trust claims');
  }

  if (sampleRender.includes('aggregateRating')) {
    reportError('Render Test', 'Non-Bradenton page contains fake aggregateRating in schema');
  } else {
    reportPass('Render Test', 'Non-Bradenton page correctly has no aggregateRating schema');
  }

  if (sampleRender.includes('https://sweetmaidcleaning.com/') && !sampleRender.includes('https://www.sweetmaidcleaning.com/')) {
    reportError('Render Test', 'Rendered URLs should use www.sweetmaidcleaning.com');
  } else {
    reportPass('Render Test', 'Canonical and schema URLs use www.sweetmaidcleaning.com');
  }
} catch (e: any) {
  reportError('Render Test', e.message);
}

// 6. Wave 2: Redirect Engine Verification
try {
  const { resolveRedirect } = require('../src/config/redirects');

  const redirectTests = [
    { input: '/home', expected: '/' },
    { input: '/home/', expected: '/' },
    { input: '/booking', expected: '/book-online/' },
    { input: '/booknow', expected: '/book-online/' },
    { input: '/contact-us', expected: '/book-online/' },
    { input: '/terms-conditions', expected: '/terms-and-conditions/' },
    { input: '/privacy', expected: '/privacy-policy/' },
    { input: '/post-construction-cleanup', expected: '/post-construction-cleaning/' },
    { input: '/hoarder-cleaning-service', expected: '/deep-cleaning/' },
    { input: '/weekly-maid-service', expected: '/recurring-maid-service/' },
    { input: '/condo-cleaning', expected: '/house-cleaning/' },
    { input: '/apartment-cleaning', expected: '/house-cleaning/' },
    { input: '/bradenton-fl/weekly-maid-service', expected: '/recurring-maid-service-bradenton-fl/' },
    { input: '/bradenton-fl/condo-cleaning', expected: '/house-cleaning-bradenton-fl/' },
    { input: '/sarasota-fl/house-cleaning', expected: '/house-cleaning-sarasota-fl/' },
    { input: '/palmetto-fl/house-cleaning', expected: '/house-cleaning-palmetto-fl/' },
    { input: '/brandon-fl/move-in-out-cleaning', expected: '/move-in-out-cleaning-brandon-fl/' },
    { input: '/longboat-key-fl/house-cleaning', expected: '/house-cleaning-longboat-key-fl/' },
    { input: '/lakewood-ranch-cleaning', expected: '/lakewood-ranch-fl/' },
    { input: '/33139', expected: '/miami-fl/' },
    { input: '/bradenton-fl', expected: '/' },
    { input: '/bradenton-fl/', expected: '/' },
    { input: '/tallahassee-fl', expected: '/locations/' },
    { input: '/tallahassee-fl/house-cleaning', expected: '/locations/' },
  ];

  let redirectFails = 0;
  for (const t of redirectTests) {
    const actual = resolveRedirect(t.input);
    if (actual !== t.expected) {
      reportError('Redirect Engine', `${t.input} -> expected ${t.expected}, got ${actual}`);
      redirectFails++;
    }
  }

  if (redirectFails === 0) {
    reportPass('Redirect Engine', `All ${redirectTests.length} redirect tests passed`);
  }

  // Non-redirecting valid URLs (flat service-first)
  const validUrls = [
    '/',
    '/services/',
    '/about/',
    '/locations/',
    '/house-cleaning/',
    '/deep-cleaning/',
    '/lakewood-ranch-fl/',
    '/sarasota-fl/',
    '/fort-lauderdale-fl/',
    '/boca-raton-fl/',
    '/west-palm-beach-fl/',
    '/orlando-fl/',
    '/kissimmee-fl/',
    '/lakeland-fl/',
    '/jacksonville-fl/',
    '/st-augustine-fl/',
    '/ponte-vedra-beach-fl/',
    '/orange-park-fl/',
    '/house-cleaning-bradenton-fl/',
    '/house-cleaning-palmetto-fl/',
    '/move-in-out-cleaning-brandon-fl/',
    '/house-cleaning-longboat-key-fl/',
    '/house-cleaning-boca-raton-fl/',
    '/house-cleaning-fort-lauderdale-fl/',
    '/house-cleaning-orlando-fl/',
    '/house-cleaning-jacksonville-fl/',
    '/house-cleaning-st-augustine-fl/'
  ];

  let loopFails = 0;
  for (const v of validUrls) {
    const res = resolveRedirect(v);
    if (res !== null && res !== v) {
      reportError('Redirect Engine Loop', `Valid URL ${v} incorrectly redirected to ${res}`);
      loopFails++;
    }
  }
  if (loopFails === 0) {
    reportPass('Redirect Engine Loop', `All ${validUrls.length} valid 200 URLs return null (no loop)`);
  }
} catch (e: any) {
  reportError('Redirect Engine', e.message);
}

async function runAsyncChecks() {
  // 7. Wave 2: Sitemap Rebuild Verification
  try {
    const { GET: getSitemap } = require('../src/app/sitemap.xml/route');
    const sitemapResponse = await getSitemap();
    const xmlBody = await sitemapResponse.text();

    if (!xmlBody.startsWith('<?xml') || !xmlBody.includes('<urlset')) {
      reportError('Sitemap Rebuild', 'sitemap.xml output is not valid XML urlset');
    } else {
      reportPass('Sitemap Rebuild', 'sitemap.xml returns valid XML urlset');
    }

    // Extract all loc tags
    const locMatches = xmlBody.match(/<loc>(.*?)<\/loc>/g) || [];
    const urlCount = locMatches.length;

    if (urlCount < 2400 || urlCount > 3500) {
      reportError('Sitemap Rebuild', `Expected URL count between 2,400 and 3,500, found ${urlCount}`);
    } else {
      reportPass('Sitemap Rebuild', `Sitemap contains ${urlCount} clean URLs (under 3,500 cap)`);
    }

    // Check all URLs start with canonical https://www.sweetmaidcleaning.com
    let nonCanonicalCount = 0;
    for (const loc of locMatches) {
      const cleanUrl = loc.replace(/<\/?loc>/g, '');
      if (!cleanUrl.startsWith('https://www.sweetmaidcleaning.com')) {
        nonCanonicalCount++;
      }
    }
    if (nonCanonicalCount > 0) {
      reportError('Sitemap Rebuild', `Found ${nonCanonicalCount} URLs not starting with https://www.sweetmaidcleaning.com`);
    } else {
      reportPass('Sitemap Rebuild', 'All sitemap URLs start with https://www.sweetmaidcleaning.com');
    }

    // Verify static public/sitemap.xml does NOT exist
    const staticSitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(staticSitemapPath)) {
      reportError('Sitemap Rebuild', 'public/sitemap.xml still exists in public directory');
    } else {
      reportPass('Sitemap Rebuild', 'Static public/sitemap.xml confirmed eradicated');
    }
  } catch (e: any) {
    reportError('Sitemap Rebuild', e.message);
  }

  // 8. Wave 2: Sitemap Shard Decommissioning Verification (410 Gone)
  try {
    const { GET: getShard } = require('../src/app/sitemap/[id]/route');
    const shardResponse = await getShard();
    if (shardResponse.status !== 410) {
      reportError('Sitemap Shard 410', `Expected 410 Gone for sitemap shards, got ${shardResponse.status}`);
    } else {
      reportPass('Sitemap Shard 410', 'Old sitemap shards return HTTP 410 Gone');
    }
  } catch (e: any) {
    reportError('Sitemap Shard 410', e.message);
  }

  // 9. Wave 2: Services Page Verification
  try {
    const servicesPath = path.join(process.cwd(), 'src', 'app', 'services', 'page.tsx');
    if (!fs.existsSync(servicesPath)) {
      reportError('Services Page', 'src/app/services/page.tsx does not exist');
    } else {
      const servicesContent = fs.readFileSync(servicesPath, 'utf8');
      if (!servicesContent.includes('https://www.sweetmaidcleaning.com/services/')) {
        reportError('Services Page', 'Services page canonical does not point to https://www.sweetmaidcleaning.com/services/');
      } else {
        reportPass('Services Page', 'Services page canonical is https://www.sweetmaidcleaning.com/services/');
      }

      // Verify all 24 services are linked
      let missingServices = 0;
      for (const svc of SERVICES) {
        if (!servicesContent.includes(`'${svc}'`) && !servicesContent.includes(`"${svc}"`)) {
          reportError('Services Page', `Service ${svc} not linked in /services/ page`);
          missingServices++;
        }
      }
      if (missingServices === 0) {
        reportPass('Services Page', 'All 24 approved services are linked on /services/ page');
      }
    }
  } catch (e: any) {
    reportError('Services Page', e.message);
  }

  // 10. Wave 3: Sprawl Decommissioning & Resolver Restriction
  try {
    const costDir = path.join(process.cwd(), 'src', 'app', 'cost');
    if (fs.existsSync(costDir)) {
      reportError('Wave 3 Sprawl', 'src/app/cost directory still exists');
    } else {
      reportPass('Wave 3 Sprawl', 'src/app/cost programmatic directory completely eradicated');
    }

    const { resolveRedirect } = require('../src/config/redirects');
    const costRedirect = resolveRedirect('/cost/bradenton-fl/house-cleaning/');
    if (costRedirect !== '/services/') {
      reportError('Wave 3 Sprawl', `/cost/... expected redirect to /services/, got ${costRedirect}`);
    } else {
      reportPass('Wave 3 Sprawl', '/cost/... redirects to /services/');
    }

    const { resolveAnyLocation, getAllLocations } = require('../src/lib/data');
    const testUnapproved = ['tallahassee-fl', '33139', '34205', 'orange-county-fl', 'random-town-fl'];
    let unapprovedResolved = 0;
    for (const u of testUnapproved) {
      if (resolveAnyLocation(u) !== null) {
        reportError('Wave 3 Sprawl', `Unapproved location ${u} unexpectedly resolved in resolveAnyLocation`);
        unapprovedResolved++;
      }
    }
    if (unapprovedResolved === 0) {
      reportPass('Wave 3 Sprawl', 'Unapproved cities, zips, and counties return null in resolveAnyLocation');
    }

    const allLocations = getAllLocations();
    const expectedCityCount = Object.keys(CITY_PAGES).length;
    if (allLocations.length !== expectedCityCount) {
      reportError('Wave 3 Sprawl', `getAllLocations expected ${expectedCityCount} approved cities, got ${allLocations.length}`);
    } else {
      reportPass('Wave 3 Sprawl', `getAllLocations strictly returns ${expectedCityCount} approved cities`);
    }
  } catch (e: any) {
    reportError('Wave 3 Sprawl', e.message);
  }

  // 11. Wave 3: Orphaned Template Cleanup
  try {
    const srvSourceDir = path.join(process.cwd(), 'templates', 'services_source');
    if (fs.existsSync(srvSourceDir)) {
      const dirs = fs.readdirSync(srvSourceDir);
      const obsolete = dirs.filter(d => !SERVICES.includes(d as any));
      if (obsolete.length > 0) {
        reportError('Wave 3 Templates', `Found obsolete template folders in services_source: ${obsolete.join(', ')}`);
      } else {
        reportPass('Wave 3 Templates', 'templates/services_source contains strictly the 24 approved services');
      }
    }
  } catch (e: any) {
    reportError('Wave 3 Templates', e.message);
  }

  console.log('\n====================================================');
  if (errorCount === 0) {
    console.log('🎉 ALL AUDIT CHECKS PASSED WITH 0 VIOLATIONS!');
    console.log('====================================================');
    process.exit(0);
  } else {
    console.error(`💥 FAILED WITH ${errorCount} VIOLATIONS!`);
    console.log('====================================================');
    process.exit(1);
  }
}

runAsyncChecks();
