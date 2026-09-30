import { formatName, serviceSlugs } from './data';
import { is305Area } from './miami_broward_slugs';
import { CANONICAL_HOST, BUSINESS_INFO, PRICING_FROM } from '@/config/site-structure';
import { PILOT_LOCATIONS_DATA } from './pilot_locations_data';

// Deterministic string hashing for consistent but unique variation per page
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface SeoContentPack {
  h1: string;
  metaTitle: string;
  heroSub: string;
  badge: string;
  dailySearchHeading: string;
  dailySearchKeywords: string[];
  searchContextParagraph: string;
  climateTitle: string;
  climateBody: string;
  ecoTitle: string;
  ecoBody: string;
  whyChooseTitle: string;
  whyChoosePoints: { title: string; desc: string; icon: string }[];
  faqs: { q: string; a: string }[];
  schemaJson: string;
}

export function formatLocationTitle(cityName: string, locSlug?: string): string {
  if (locSlug && PILOT_LOCATIONS_DATA[locSlug]) {
    return PILOT_LOCATIONS_DATA[locSlug].title;
  }
  const matchingSlug = Object.keys(PILOT_LOCATIONS_DATA).find(
    s => PILOT_LOCATIONS_DATA[s].name.toLowerCase() === cityName.toLowerCase()
  );
  if (matchingSlug) {
    return PILOT_LOCATIONS_DATA[matchingSlug].title;
  }
  const cleanCity = cityName.replace(/\s*\(.*?\)/g, '').trim();
  const full = `Cleaning Services in ${cleanCity}, FL | Sweet Maid Cleaning Service`;
  if (full.length <= 60) {
    return full;
  }
  const short = `Cleaning Services in ${cleanCity}, FL | Sweet Maid`;
  if (short.length <= 65) {
    return short;
  }
  return `Cleaning in ${cleanCity}, FL | Sweet Maid`;
}

export function formatLocationH1(cityName: string, locSlug?: string): string {
  if (locSlug && PILOT_LOCATIONS_DATA[locSlug]) {
    return PILOT_LOCATIONS_DATA[locSlug].h1;
  }
  const matchingSlug = Object.keys(PILOT_LOCATIONS_DATA).find(
    s => PILOT_LOCATIONS_DATA[s].name.toLowerCase() === cityName.toLowerCase()
  );
  if (matchingSlug) {
    return PILOT_LOCATIONS_DATA[matchingSlug].h1;
  }
  const cleanCity = cityName.replace(/\s*\(.*?\)/g, '').trim();
  return `Cleaning Services in ${cleanCity}, FL`;
}

export function formatLocationMeta(cityName: string, locSlug?: string): string {
  if (locSlug && PILOT_LOCATIONS_DATA[locSlug]) {
    return PILOT_LOCATIONS_DATA[locSlug].metaDescription;
  }
  const matchingSlug = Object.keys(PILOT_LOCATIONS_DATA).find(
    s => PILOT_LOCATIONS_DATA[s].name.toLowerCase() === cityName.toLowerCase()
  );
  if (matchingSlug) {
    return PILOT_LOCATIONS_DATA[matchingSlug].metaDescription;
  }
  const cleanCity = cityName.replace(/\s*\(.*?\)/g, '').trim();
  return `Professional cleaning services in ${cleanCity}, FL. Family-owned recurring house cleaning, deep cleaning resets, and move-out turnovers. Get a free quote.`;
}

export function getCalibratedMetaTitle(
  locationName: string,
  locSlug: string,
  serviceSlug: string,
  seed: number
): string {
  const isStatewide = locationName.toLowerCase() === 'florida' || locSlug === 'fl' || serviceSlugs.includes(locSlug);
  
  let cleanSrv = formatName(serviceSlug.replace(/-/g, ' '));
  const shortServiceMap: Record<string, string> = {
    'medical-dental-facility-cleaning': 'Medical & Dental Cleaning',
    'industrial-warehouse-cleaning': 'Warehouse Cleaning',
    'church-worship-center-cleaning': 'Church & Worship Cleaning',
    'property-management-janitorial': 'Property Janitorial',
    'law-firm-office-cleaning': 'Law Firm Cleaning',
    'restaurant-kitchen-cleaning': 'Commercial Kitchen Cleaning',
    'gym-fitness-center-cleaning': 'Gym & Fitness Cleaning',
    'oven-appliance-deep-cleaning': 'Oven & Appliance Cleaning',
    'eviction-cleanout-service': 'Eviction Cleanout',
    'hoarder-cleaning-service': 'Hoarding Cleanout',
    'exterior-soft-washing': 'Exterior Soft Washing',
    'tile-and-grout-cleaning': 'Tile & Grout Cleaning',
    'pet-hair-removal-cleaning': 'Pet Hair Cleaning',
    'post-construction-cleaning': 'Post-Construction Cleaning',
    'post-renovation-cleaning': 'Post-Renovation Cleaning',
    'luxury-penthouse-cleaning': 'Penthouse Cleaning',
    'luxury-estate-cleaning': 'Luxury Estate Cleaning',
    'vacation-rental-cleaning': 'Vacation Rental Cleaning',
    'janitorial-cleaning-services': 'Janitorial Services',
    'office-janitorial-services': 'Office Janitorial Services',
    'school-daycare-cleaning': 'Daycare & School Cleaning'
  };

  const displaySrv = shortServiceMap[serviceSlug] || cleanSrv;

  if (isStatewide) {
    const full = `${displaySrv} Across Florida | Sweet Maid Cleaning Service`;
    if (full.length <= 60) return full;
    return `${displaySrv} Across Florida | Sweet Maid`;
  }

  const cleanLoc = formatName(locationName).replace(/\s*\(.*?\)/g, '').trim();

  const full = `${displaySrv} in ${cleanLoc}, FL | Sweet Maid Cleaning Service`;
  if (full.length <= 60) {
    return full;
  }
  const short = `${displaySrv} in ${cleanLoc}, FL | Sweet Maid`;
  if (short.length <= 65) {
    return short;
  }
  const ultraCompactSrv = displaySrv.replace(/\s+Cleaning$/, '').replace(/\s+Services$/, '');
  const compact = `${ultraCompactSrv} in ${cleanLoc}, FL | Sweet Maid`;
  if (compact.length <= 65) {
    return compact;
  }
  return compact.slice(0, 62) + '...';
}

export function generateSeoContentPack(
  locationName: string,
  locSlug: string,
  serviceName: string,
  serviceSlug: string
): SeoContentPack {
  const seed = hashCode(`${locSlug}-${serviceSlug}`);
  const cleanLoc = formatName(locationName).replace(/\s*\(.*?\)/g, '').trim();
  let cleanSrv = formatName(serviceName.replace(/-/g, ' '));
  if (!cleanSrv.toLowerCase().endsWith('services') && !cleanSrv.toLowerCase().endsWith('service')) {
    cleanSrv += ' Services';
  }

  const pilot = PILOT_LOCATIONS_DATA[locSlug];
  const isBaseLocation = !serviceSlug || serviceSlug === 'cleaning' || serviceSlug === locSlug;

  const metaTitle = (pilot && isBaseLocation)
    ? pilot.title
    : getCalibratedMetaTitle(cleanLoc, locSlug, serviceSlug, seed);

  // Service-Specific H1 Dictionary (Zero "#1", Zero "Best ", Zero "Top-Rated")
  const isStatewide = cleanLoc.toLowerCase() === 'florida' || serviceSlugs.includes(locSlug);

  const defaultH1s = isStatewide ? [
    `${cleanSrv} Across Florida`,
    `Professional ${cleanSrv} Across Florida`,
    `Reliable ${cleanSrv} in Florida`
  ] : [
    `${cleanSrv} in ${cleanLoc}, FL`,
    `Professional ${cleanSrv} in ${cleanLoc}, FL`,
    `Reliable ${cleanSrv} in ${cleanLoc}, FL`,
    `Local ${cleanSrv} in ${cleanLoc}, FL`
  ];

  let h1 = (pilot && isBaseLocation) ? pilot.h1 : defaultH1s[seed % defaultH1s.length];

  // Daily search keywords
  const dailyKeywordPools = [
    [
      `house cleaning near me in ${cleanLoc}`,
      `maid service ${cleanLoc} FL`,
      `affordable ${cleanSrv.toLowerCase()} ${cleanLoc}`,
      `professional house cleaners ${cleanLoc} Florida`,
      `home sanitization ${cleanLoc}`,
      `family-owned maids ${cleanLoc}`,
      `weekly recurring cleaning ${cleanLoc}`
    ],
    [
      `professional cleaners near me in ${cleanLoc}`,
      `maid service near me ${cleanLoc} FL`,
      `${cleanSrv.toLowerCase()} company ${cleanLoc}`,
      `move out cleaning cost ${cleanLoc}`,
      `condo and home cleaners ${cleanLoc}`,
      `commercial janitorial service ${cleanLoc}`,
      `housekeeper in ${cleanLoc} Florida`
    ]
  ];

  const dailySearchKeywords = dailyKeywordPools[seed % dailyKeywordPools.length];

  // Badges (Honest, factual only)
  const badges = isStatewide ? [
    `📍 Serving Florida Communities`,
    `✨ Family-Owned Cleaning Service`,
    `🧹 Professional Cleaning Specialists Across Florida`
  ] : [
    `📍 Serving ${cleanLoc} & Nearby Areas`,
    `✨ Family-Owned Cleaning Service`,
    `🧹 Professional Cleaning Specialists in ${cleanLoc}`
  ];
  const badge = pilot ? pilot.badge : badges[seed % badges.length];

  // Hero Subtitle & Meta Description: Calibrated strictly between 140-160 chars, zero banned words
  const heroSubs = isStatewide ? [
    `Professional ${cleanSrv.toLowerCase()} across Florida. Family-owned team with transparent flat rates, reliable scheduling, and detailed care. Request a free quote.`,
    `Reliable ${cleanSrv.toLowerCase()} across Florida by Sweet Maid. Family-owned specialists delivering detail-oriented care and upfront pricing. Get a free quote.`,
    `Quality ${cleanSrv.toLowerCase()} across Florida with Sweet Maid Cleaning Service. Dependable recurring visits, deep cleans, and custom care. Get a free quote.`,
    `Looking for ${cleanSrv.toLowerCase()} across Florida? Sweet Maid offers family-owned residential care, transparent rates, and easy scheduling. Free quote today.`
  ] : [
    `Professional ${cleanSrv.toLowerCase()} in ${cleanLoc}, FL. Family-owned team with transparent flat rates, reliable scheduling, and thorough care. Request a free quote.`,
    `Reliable ${cleanSrv.toLowerCase()} in ${cleanLoc}, FL by Sweet Maid. Family-owned specialists delivering detail-oriented care and upfront pricing. Get a free quote.`,
    `Quality ${cleanSrv.toLowerCase()} in ${cleanLoc}, FL with Sweet Maid Cleaning Service. Dependable recurring visits, deep cleans, and custom care. Get a free quote.`,
    `Looking for ${cleanSrv.toLowerCase()} in ${cleanLoc}, FL? Sweet Maid offers family-owned residential care, transparent rates, and easy scheduling. Free quote today.`
  ];
  const heroSub = (pilot && isBaseLocation) ? pilot.heroSub : heroSubs[seed % heroSubs.length];

  const searchContextParagraph = pilot
    ? `Sweet Maid Cleaning Service provides scheduled visits, deep seasonal cleans, and turnover care for single-family homes, condominiums, and commercial properties throughout ${cleanLoc} and surrounding areas.`
    : (isStatewide
      ? `Sweet Maid Cleaning Service provides scheduled visits, deep seasonal cleans, and turnover care for single-family homes, condominiums, and commercial properties across Florida.`
      : `Sweet Maid Cleaning Service provides scheduled visits, deep seasonal cleans, and turnover care for single-family homes, condominiums, and commercial properties in ${cleanLoc} and surrounding areas.`);

  const dailySearchHeading = isStatewide ? `Common Cleaning Inquiries Across Florida` : `Cleaning Services in ${cleanLoc}, FL`;

  const isCoastal = locSlug.includes('beach') || locSlug.includes('key') || locSlug.includes('isles') || locSlug.includes('shores') || locSlug.includes('miami') || locSlug.includes('sarasota') || locSlug.includes('tampa') || locSlug.includes('naples');
  
  const climateTitle = pilot ? pilot.climateTitle : (isCoastal
    ? `Managing Coastal Salt Air & Humidity in ${cleanLoc}`
    : `Addressing Florida Dust & Humidity in ${cleanLoc}`);

  const climateBody = pilot ? pilot.climateBody : (isCoastal
    ? `Coastal Florida properties in ${cleanLoc} require focused care to address salt air residue, tracked-in beach sand, and indoor moisture. Our cleaning routines prioritize glass surfaces, ventilation grilles, and floor care.`
    : `Florida homes in ${cleanLoc} face year-round humidity and dust accumulation. Our systematic cleaning methods focus on indoor air quality, thorough dusting, and sanitization of high-contact surfaces.`);

  const ecoTitle = `Quality Supplies & Effective Techniques`;
  const ecoBody = `Our cleaning specialists utilize commercial HEPA filtration vacuums and color-coded microfiber cloths to prevent cross-contamination between bathrooms, kitchens, and living spaces.`;

  const whyChooseTitle = pilot ? pilot.whyChooseTitle : `Why Choose Sweet Maid Cleaning Service in ${cleanLoc}`;
  const whyChoosePoints = pilot ? pilot.whyChoosePoints : [
    { title: 'Family-Owned Care', desc: 'Direct communication, consistent standards, and personal accountability on every visit.', icon: 'fa-heart' },
    { title: 'Transparent Pricing', desc: 'Clear flat-rate estimates based on your home size and service requirements with no hidden fees.', icon: 'fa-tag' },
    { title: 'Reliable Scheduling', desc: 'Dependable recurring appointments on weekly, bi-weekly, or monthly intervals that fit your routine.', icon: 'fa-calendar-check' },
    { title: 'Detailed Checklist', desc: 'Thorough cleaning across kitchens, bathrooms, floors, and living spaces following a consistent scope.', icon: 'fa-list-check' }
  ];

  // Realistic starting price lookup matching pricing.json exactly
  let startingPrice = PRICING_FROM.standard_cleaning;
  if (serviceSlug.includes('deep')) startingPrice = PRICING_FROM.deep_clean;
  else if (serviceSlug.includes('move')) startingPrice = PRICING_FROM.move_out;
  else if (serviceSlug.includes('airbnb')) startingPrice = PRICING_FROM.airbnb;
  else if (serviceSlug.includes('post-construction')) startingPrice = PRICING_FROM.post_construction;
  else if (serviceSlug.includes('commercial') || serviceSlug.includes('office') || serviceSlug.includes('janitorial')) startingPrice = PRICING_FROM.office_workplace;

  // Safe service name handling to prevent duplicate deep prefix
  const isDeepService = serviceSlug.includes('deep');
  const deepPhrase = isDeepService ? cleanSrv.toLowerCase() : `deep ${cleanSrv.toLowerCase()}`;

  const faqs = (pilot && isBaseLocation) ? pilot.faqs : [
    {
      q: `What is included with ${cleanSrv.toLowerCase()} in ${cleanLoc}?`,
      a: `Our ${cleanSrv.toLowerCase()} in ${cleanLoc} includes detailed dusting, vacuuming carpets and rugs, mopping hard floors, sanitizing kitchen counters and sinks, cleaning bathroom fixtures, and emptying wastebaskets.`
    },
    {
      q: `How much does ${cleanSrv.toLowerCase()} cost in ${cleanLoc}, Florida?`,
      a: `Pricing for ${cleanSrv.toLowerCase()} in ${cleanLoc} starts from $${startingPrice}, with final rates depending on total square footage, the number of bedrooms and bathrooms, and the condition of the property. Request a free quote online for an exact estimate.`
    },
    {
      q: `How often should I schedule ${cleanSrv.toLowerCase()} for my ${cleanLoc} home?`,
      a: `Most clients in ${cleanLoc} schedule bi-weekly recurring cleaning for balanced home upkeep. Weekly visits are ideal for larger households with pets, while monthly appointments work well for seasonal retreats.`
    },
    {
      q: `Do I need to be home during the ${cleanSrv.toLowerCase()} in ${cleanLoc}?`,
      a: `No, you do not need to be present. Many clients in ${cleanLoc} provide a door code, lockbox key, or front desk authorization. Our team secures the property upon departure.`
    },
    {
      q: `What is the difference between regular maintenance and ${deepPhrase} in ${cleanLoc}?`,
      a: `Regular cleaning focuses on routine upkeep: wiping surfaces, vacuuming, mopping, and bathroom sanitizing. A deep clean includes intensive detailing of baseboards, interior cabinet surfaces, door frames, and high-reach vents.`
    }
  ];

  // Clean, compliant JSON-LD schema
  const isPhone305 = is305Area(locSlug, cleanLoc);
  const phone = pilot ? pilot.phone : (isPhone305 ? '(305) 851-6959' : BUSINESS_INFO.phone);
  const pageUrl = isStatewide
    ? `${CANONICAL_HOST}/${serviceSlug}/`
    : `${CANONICAL_HOST}/${serviceSlug}-${locSlug}/`;

  const schemaObj = [
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService", "Organization"],
      "name": BUSINESS_INFO.name,
      "description": heroSub.replace(/<[^>]+>/g, ''),
      "url": pageUrl,
      "telephone": phone,
      "email": BUSINESS_INFO.email,
      "image": `${CANONICAL_HOST}/images/logo.png`,
      "priceRange": "$$",
      "sameAs": BUSINESS_INFO.socialProfiles,
      ...(locSlug === 'bradenton-fl' ? {
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Bradenton, FL",
          "addressLocality": "Bradenton",
          "addressRegion": "FL",
          "addressCountry": "US"
        }
      } : {}),
      "areaServed": {
        "@type": "City",
        "name": `${cleanLoc}, FL`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${cleanSrv} in ${cleanLoc}, FL`,
      "provider": {
        "@type": "LocalBusiness",
        "name": BUSINESS_INFO.name,
        "telephone": phone
      },
      "areaServed": {
        "@type": "City",
        "name": `${cleanLoc}, FL`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": isStatewide ? [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${CANONICAL_HOST}/` },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": `${CANONICAL_HOST}/services/` },
        { "@type": "ListItem", "position": 3, "name": cleanSrv, "item": pageUrl }
      ] : [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${CANONICAL_HOST}/` },
        { "@type": "ListItem", "position": 2, "name": cleanLoc, "item": `${CANONICAL_HOST}/${locSlug}/` },
        { "@type": "ListItem", "position": 3, "name": cleanSrv, "item": pageUrl }
      ]
    }
  ];

  return {
    h1,
    metaTitle,
    heroSub,
    badge,
    dailySearchHeading,
    dailySearchKeywords,
    searchContextParagraph,
    climateTitle,
    climateBody,
    ecoTitle,
    ecoBody,
    whyChooseTitle,
    whyChoosePoints,
    faqs,
    schemaJson: JSON.stringify(schemaObj)
  };
}
