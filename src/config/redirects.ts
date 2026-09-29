import { CITY_PAGES, REGIONS, SERVICES, COMBO_PAGES, resolveFlatCombo } from './site-structure';

export interface RedirectRule {
  source: string;
  destination: string;
  permanent?: boolean;
}

// 1. Exact static path redirects (Priority 1)
export const EXACT_REDIRECTS: RedirectRule[] = [
  // Legacy Site Pages
  { source: '/home', destination: '/' },
  { source: '/home/', destination: '/' },
  { source: '/contact', destination: '/book-online/' },
  { source: '/contact/', destination: '/book-online/' },
  { source: '/contact-us', destination: '/book-online/' },
  { source: '/contact-us/', destination: '/book-online/' },
  { source: '/booking', destination: '/book-online/' },
  { source: '/booking/', destination: '/book-online/' },
  { source: '/booknow', destination: '/book-online/' },
  { source: '/booknow/', destination: '/book-online/' },
  { source: '/terms-conditions', destination: '/terms-and-conditions/' },
  { source: '/terms-conditions/', destination: '/terms-and-conditions/' },
  { source: '/terms', destination: '/terms-and-conditions/' },
  { source: '/terms/', destination: '/terms-and-conditions/' },
  { source: '/terms-of-service', destination: '/terms-and-conditions/' },
  { source: '/terms-of-service/', destination: '/terms-and-conditions/' },
  { source: '/privacy', destination: '/privacy-policy/' },
  { source: '/privacy/', destination: '/privacy-policy/' },

  // Decommissioned & Legacy Services
  { source: '/post-construction-cleanup', destination: '/post-construction-cleaning/' },
  { source: '/post-construction-cleanup/', destination: '/post-construction-cleaning/' },
  { source: '/home-cleaning', destination: '/house-cleaning/' },
  { source: '/home-cleaning/', destination: '/house-cleaning/' },
  { source: '/residential-cleaning', destination: '/house-cleaning/' },
  { source: '/residential-cleaning/', destination: '/house-cleaning/' },
  { source: '/commercial-cleaning-services', destination: '/commercial-cleaning/' },
  { source: '/commercial-cleaning-services/', destination: '/commercial-cleaning/' },
  { source: '/office-cleaning', destination: '/office-janitorial-services/' },
  { source: '/office-cleaning/', destination: '/office-janitorial-services/' },
  { source: '/janitorial-services', destination: '/janitorial-cleaning-services/' },
  { source: '/janitorial-services/', destination: '/janitorial-cleaning-services/' },
  { source: '/airbnb-vacation-rental-management', destination: '/airbnb-cleaning/' },
  { source: '/airbnb-vacation-rental-management/', destination: '/airbnb-cleaning/' },
  { source: '/luxury-estate-management', destination: '/luxury-estate-cleaning/' },
  { source: '/luxury-estate-management/', destination: '/luxury-estate-cleaning/' },
  { source: '/hoarder-cleaning-service', destination: '/deep-cleaning/' },
  { source: '/hoarder-cleaning-service/', destination: '/deep-cleaning/' },
  { source: '/weekly-maid-service', destination: '/recurring-maid-service/' },
  { source: '/weekly-maid-service/', destination: '/recurring-maid-service/' },
  { source: '/condo-cleaning', destination: '/house-cleaning/' },
  { source: '/condo-cleaning/', destination: '/house-cleaning/' },
  { source: '/apartment-cleaning', destination: '/house-cleaning/' },
  { source: '/apartment-cleaning/', destination: '/house-cleaning/' },
  { source: '/maid-service', destination: '/house-cleaning/' },
  { source: '/maid-service/', destination: '/house-cleaning/' },
  { source: '/florida-beach-cleaning', destination: '/locations/' },
  { source: '/florida-beach-cleaning/', destination: '/locations/' },
  { source: '/florida-cleaning', destination: '/locations/' },
  { source: '/florida-cleaning/', destination: '/locations/' },

  // Prompt Explicit Examples
  { source: '/lakewood-ranch-cleaning', destination: '/lakewood-ranch-fl/' },
  { source: '/lakewood-ranch-cleaning/', destination: '/lakewood-ranch-fl/' },
  { source: '/house-cleaning-service-sarasota-fl', destination: '/house-cleaning-sarasota-fl/' },
  { source: '/house-cleaning-service-sarasota-fl/', destination: '/house-cleaning-sarasota-fl/' },
  { source: '/south-miami', destination: '/south-miami-fl/' },
  { source: '/south-miami/', destination: '/south-miami-fl/' },
  { source: '/port-charlotte-cleaning', destination: '/port-charlotte-fl/' },
  { source: '/port-charlotte-cleaning/', destination: '/port-charlotte-fl/' },
  { source: '/cleaning-service-marathon-fl', destination: '/marathon-fl/' },
  { source: '/cleaning-service-marathon-fl/', destination: '/marathon-fl/' },
  { source: '/saint-augustine-fl', destination: '/st-augustine-fl/' },
  { source: '/saint-augustine-fl/', destination: '/st-augustine-fl/' },
  { source: '/saint-augustine-beach-fl', destination: '/st-augustine-beach-fl/' },
  { source: '/saint-augustine-beach-fl/', destination: '/st-augustine-beach-fl/' },
  { source: '/saint-augustine', destination: '/st-augustine-fl/' },
  { source: '/saint-augustine/', destination: '/st-augustine-fl/' },
  { source: '/st-augustine', destination: '/st-augustine-fl/' },
  { source: '/st-augustine/', destination: '/st-augustine-fl/' },
  { source: '/jacksonville', destination: '/jacksonville-fl/' },
  { source: '/jacksonville/', destination: '/jacksonville-fl/' }
];

// 2. Decommissioned service slug mapping
export const DECOMMISSIONED_SERVICES: Record<string, string> = {
  'airbnb-vacation-rental-management': 'airbnb-cleaning',
  'luxury-estate-management': 'luxury-estate-cleaning',
  'hoarder-cleaning-service': 'deep-cleaning',
  'weekly-maid-service': 'recurring-maid-service',
  'condo-cleaning': 'house-cleaning',
  'apartment-cleaning': 'house-cleaning',
  'maid-service': 'house-cleaning',
  'home-cleaning': 'house-cleaning',
  'residential-cleaning': 'house-cleaning',
  'commercial-cleaning-services': 'commercial-cleaning',
  'office-cleaning': 'office-janitorial-services',
  'janitorial-services': 'janitorial-cleaning-services',
  'post-construction-cleanup': 'post-construction-cleaning'
};

// 3. Flat combo map lookup: e.g. 'bradenton-fl/house-cleaning' -> '/house-cleaning-bradenton-fl/'
export const NESTED_TO_FLAT_COMBOS: Record<string, string> = {};
for (const combo of Object.values(COMBO_PAGES)) {
  const nestedKey = `${combo.citySlug}/${combo.service}`;
  NESTED_TO_FLAT_COMBOS[nestedKey] = `/${combo.slug}/`;
}

// 4. Resolve dynamic redirects for decommissioned services, legacy combos, and non-approved cities
export function resolveRedirect(pathname: string): string | null {
  // Normalize path
  let cleanPath = pathname.trim();
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  const pathNoSlash = cleanPath.endsWith('/') && cleanPath !== '/' ? cleanPath.slice(0, -1) : cleanPath;
  const pathWithSlash = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/';

  // A. Check exact redirects
  for (const r of EXACT_REDIRECTS) {
    if (r.source === pathNoSlash || r.source === pathWithSlash) {
      return r.destination;
    }
  }

  // B. Parse segments
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  // Segment 1: e.g. 'bradenton-fl' or 'weekly-maid-service'
  const seg1 = segments[0].toLowerCase();
  const seg2 = segments[1]?.toLowerCase();

  // B0. Cost estimator deprecation: redirect all /cost/... paths to /services/
  if (seg1 === 'cost') {
    return '/services/';
  }

  // B1. Standalone decommissioned service: /{service}/ OR flat decommissioned combo: /{decommissionedService}-{city}/
  if (segments.length === 1) {
    if (DECOMMISSIONED_SERVICES[seg1]) {
      return `/${DECOMMISSIONED_SERVICES[seg1]}/`;
    }
    for (const [decomService, canonicalService] of Object.entries(DECOMMISSIONED_SERVICES)) {
      if (seg1.startsWith(`${decomService}-`)) {
        const cityPart = seg1.slice(decomService.length + 1);
        return `/${canonicalService}-${cityPart}/`;
      }
    }
  }

  // B2. Nested combo: /{citySlug}/{service}/ -> ALWAYS redirect (301) to flat service-first /{service}-{citySlug}/
  if (segments.length === 2 && seg2) {
    // Master Rule 1: Per-city /about/ and /blog/ pages 301 to site-wide /about/ and /blog/
    if (seg2 === 'about') {
      return '/about/';
    }
    if (seg2 === 'blog') {
      return '/blog/';
    }
    if (seg2 === 'gallery') {
      return null;
    }

    const canonicalService = DECOMMISSIONED_SERVICES[seg2] || seg2;

    // Special case for Longboat Key: /{service}-longboat-key-fl/
    if (seg1 === 'longboat-key-fl') {
      return `/${canonicalService}-longboat-key-fl/`;
    }

    const isApprovedCity = !!CITY_PAGES[seg1] || seg1 === 'bradenton-fl';
    const isApprovedService = (SERVICES as readonly string[]).includes(canonicalService);

    if (isApprovedCity && isApprovedService) {
      return `/${canonicalService}-${seg1}/`;
    }

    // Check existing NESTED_TO_FLAT_COMBOS table as fallback
    const comboKey = `${seg1}/${seg2}`;
    if (NESTED_TO_FLAT_COMBOS[comboKey]) {
      return NESTED_TO_FLAT_COMBOS[comboKey];
    }
  }

  // B3. Check if seg1 is a 5-digit zip code (e.g. /33139/)
  if (/^\d{5}$/.test(seg1)) {
    // Redirect zip codes into parent regional hub
    if (seg1.startsWith('330') || seg1.startsWith('331') || seg1.startsWith('332')) {
      return '/miami-fl/';
    } else if (seg1.startsWith('342')) {
      return '/sarasota-fl/';
    } else if (seg1.startsWith('335') || seg1.startsWith('336')) {
      return '/tampa-fl/';
    } else if (seg1.startsWith('337')) {
      return '/st-petersburg-fl/';
    }
    return '/locations/';
  }

  // B4. Check if seg1 is an unapproved town/city not in CITY_PAGES, SERVICES, or REGIONS
  const isApprovedCity = !!CITY_PAGES[seg1];
  const isApprovedService = (SERVICES as readonly string[]).includes(seg1);
  const isRegionHub = Object.values(REGIONS).some(r => r.slug === seg1);
  const isCombo = !!COMBO_PAGES[seg1] || resolveFlatCombo(seg1) !== null;
  const isStatic = ['about', 'services', 'locations', 'blog', 'gallery', 'book-online', 'booknow', 'login', 'terms-and-conditions', 'privacy-policy'].includes(seg1);

  if (!isApprovedCity && !isApprovedService && !isRegionHub && !isCombo && !isStatic) {
    // Try matching to a region by town name
    const normalizedName = seg1.replace(/-fl$/, '').replace(/-/g, ' ');
    for (const region of Object.values(REGIONS)) {
      if (region.placesServed.some(p => p.toLowerCase() === normalizedName)) {
        return region.slug ? `/${region.slug}/` : '/';
      }
    }
    // Fallback unapproved city to /locations/
    return '/locations/';
  }

  return null;
}
