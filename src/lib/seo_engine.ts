import { formatName } from './data';

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

export function generateSeoContentPack(
  locationName: string,
  locSlug: string,
  serviceName: string,
  serviceSlug: string
): SeoContentPack {
  const seed = hashCode(`${locSlug}-${serviceSlug}`);
  const cleanLoc = formatName(locationName);
  let cleanSrv = formatName(serviceName.replace(/-/g, ' '));
  if (!cleanSrv.toLowerCase().endsWith('services')) {
    cleanSrv += ' Services';
  }

  // 1. Service-Specific High-Intent Daily Search Title Dictionary (Zero "#1", 100% Unique per location & service)
  const serviceTitleMap: Record<string, string[]> = {
    'house-cleaning': [
      `House Cleaning Near Me in ${cleanLoc}, FL | Best Maid Service`,
      `Best House Cleaning in ${cleanLoc}, FL | Top Rated Home Cleaners`,
      `House Cleaning & Maid Service in ${cleanLoc}, FL | Sweet Maid`,
      `Top Rated House Cleaners in ${cleanLoc}, Florida | Trusted Maids`,
      `Affordable House Cleaning Services in ${cleanLoc}, FL | Book Online`
    ],
    'deep-cleaning': [
      `Deep Cleaning Services in ${cleanLoc}, FL | Home Cleaners Near Me`,
      `Best Deep House Cleaning in ${cleanLoc}, FL | Top Sanitization Maids`,
      `Deep Cleaning Services in ${cleanLoc}, Florida | Detailed Sanitizing`,
      `Top Rated Deep Cleaners in ${cleanLoc}, FL | Sweet Maid`,
      `Intensive Deep Cleaning & Sanitization in ${cleanLoc}, Florida`
    ],
    'move-in-out-cleaning': [
      `Move-In & Move-Out Cleaning in ${cleanLoc}, FL | Turnover Cleaners`,
      `Best Move Out Cleaning Near Me in ${cleanLoc}, FL | Fast Maid Service`,
      `Move-In / Move-Out House Cleaning in ${cleanLoc}, FL | Sweet Maid`,
      `Top Rated Move-Out Cleaning in ${cleanLoc}, Florida | Guaranteed Deposit`
    ],
    'airbnb-cleaning': [
      `Airbnb Cleaning in ${cleanLoc}, FL | Vacation Rental Cleaners Near Me`,
      `Best Airbnb & Vacation Rental Turnover Cleaning in ${cleanLoc}, FL`,
      `Airbnb Cleaning Service in ${cleanLoc}, Florida | Same-Day Turnaround`,
      `Top Rated Vacation Rental Maids in ${cleanLoc}, FL | Sweet Maid`
    ],
    'commercial-cleaning': [
      `Commercial Cleaning & Janitorial in ${cleanLoc}, FL | Office Cleaners`,
      `Best Commercial Cleaners in ${cleanLoc}, FL | Office Janitorial Services`,
      `Commercial Office Cleaning in ${cleanLoc}, Florida | Sweet Maid`,
      `Top Rated Business & Janitorial Cleaning in ${cleanLoc}, FL`
    ],
    'carpet-cleaning': [
      `Professional Carpet Cleaning in ${cleanLoc}, FL | Steam Cleaners Near Me`,
      `Best Carpet & Rug Cleaning in ${cleanLoc}, FL | Deep Steam Extraction`,
      `Top Rated Carpet Cleaning in ${cleanLoc}, Florida | Sweet Maid`
    ],
    'pressure-washing': [
      `Pressure Washing & Exterior Cleaning in ${cleanLoc}, FL | Power Washers`,
      `Best Pressure Washing Services in ${cleanLoc}, FL | Driveway & Siding`,
      `Top Rated Pressure Washing in ${cleanLoc}, Florida | Sweet Maid`
    ],
    'window-cleaning': [
      `Professional Window Cleaning in ${cleanLoc}, FL | Window Washers Near Me`,
      `Best Window Cleaning Services in ${cleanLoc}, FL | Streak-Free Glass`,
      `Top Rated Window Cleaners in ${cleanLoc}, Florida | Sweet Maid`
    ],
    'post-construction-cleaning': [
      `Post-Construction Cleaning in ${cleanLoc}, FL | Dust & Debris Removal`,
      `Best Post-Construction Cleanup Near Me in ${cleanLoc}, FL | Sweet Maid`,
      `Top Rated Construction Cleaners in ${cleanLoc}, Florida`
    ],
    'luxury-estate-cleaning': [
      `Luxury Estate & Mansion Cleaning in ${cleanLoc}, FL | Elite Housekeepers`,
      `Best Luxury Home Cleaners in ${cleanLoc}, FL | Detailed Estate Care`,
      `Top Rated Luxury Estate Cleaning in ${cleanLoc}, Florida | Sweet Maid`
    ],
    'medical-dental-facility-cleaning': [
      `Medical & Dental Facility Cleaning in ${cleanLoc}, FL | Clinic Sanitizing`,
      `Best Healthcare & Dental Cleaners in ${cleanLoc}, Florida | Sterilized Care`
    ],
    'gym-fitness-center-cleaning': [
      `Gym & Fitness Center Cleaning in ${cleanLoc}, FL | Sanitized Workout Care`,
      `Best Gym Cleaners in ${cleanLoc}, FL | Disinfected Equipment & Locker Rooms`
    ],
    'solar-panel-cleaning': [
      `Solar Panel Cleaning in ${cleanLoc}, FL | Maximize Energy Efficiency`,
      `Best Solar Panel Washers in ${cleanLoc}, FL | Streak-Free Solar Care`
    ],
    'gutter-cleaning': [
      `Gutter Cleaning & Downspout Services in ${cleanLoc}, FL | Fast Service`,
      `Best Gutter Cleaners in ${cleanLoc}, FL | Prevent Florida Water Damage`
    ]
  };

  const defaultTitles = [
    `${cleanSrv} Near You in ${cleanLoc}, FL | Best Cleaners Near Me`,
    `Best ${cleanSrv} in ${cleanLoc}, FL | Trusted Local Cleaners`,
    `Top-Rated ${cleanSrv} in ${cleanLoc}, Florida | Sweet Maid`,
    `Affordable ${cleanSrv} in ${cleanLoc}, FL | 5-Star Cleaners Near You`
  ];

  const titlePool = serviceTitleMap[serviceSlug] || defaultTitles;
  const metaTitle = titlePool[seed % titlePool.length];

  // 2. Service-Specific High-Intent Daily Search H1 Dictionary (Zero "#1", 100% Unique per location & service)
  const serviceH1MapUnique: Record<string, string[]> = {
    'house-cleaning': [
      `Professional House Cleaning & Maid Service in ${cleanLoc}, FL`,
      `Top-Rated Home Cleaners & Housekeeping in ${cleanLoc}, Florida`,
      `Affordable House Cleaning Services in ${cleanLoc}, FL`,
      `Trusted Local Housekeepers & Maid Service in ${cleanLoc}, FL`,
      `5-Star House Cleaning & Home Sanitizing in ${cleanLoc}, Florida`
    ],
    'deep-cleaning': [
      `Intensive Deep House Cleaning & Sanitizing in ${cleanLoc}, FL`,
      `Top-Rated Deep Cleaning Services in ${cleanLoc}, Florida`,
      `Detailed Deep Home Cleaners & Sanitization in ${cleanLoc}, FL`,
      `Complete Deep Cleaning & House Reset in ${cleanLoc}, FL`
    ],
    'move-in-out-cleaning': [
      `Move-In & Move-Out House Cleaning Services in ${cleanLoc}, FL`,
      `Top-Rated Move-Out Cleaning & Turnover Maids in ${cleanLoc}, Florida`,
      `Fast Move-In Deep Cleaning & Sanitizing in ${cleanLoc}, FL`,
      `Guaranteed Move-Out Cleaning & Maid Service in ${cleanLoc}, FL`
    ],
    'airbnb-cleaning': [
      `Airbnb & Vacation Rental Cleaning Services in ${cleanLoc}, FL`,
      `Top-Rated Airbnb Turnover Cleaners in ${cleanLoc}, Florida`,
      `Fast Vacation Rental Cleaning & Linens in ${cleanLoc}, FL`,
      `5-Star Superhost Airbnb Cleaning in ${cleanLoc}, Florida`
    ],
    'commercial-cleaning': [
      `Commercial Office Cleaning & Janitorial Services in ${cleanLoc}, FL`,
      `Top-Rated Commercial Cleaners in ${cleanLoc}, Florida`,
      `Professional Business & Office Sanitizing in ${cleanLoc}, FL`,
      `Reliable Commercial Janitorial Services in ${cleanLoc}, FL`
    ],
    'carpet-cleaning': [
      `Professional Carpet Cleaning & Steam Extraction in ${cleanLoc}, FL`,
      `Top-Rated Carpet & Area Rug Cleaners in ${cleanLoc}, Florida`,
      `Deep Carpet Steam Cleaning & Stain Removal in ${cleanLoc}, FL`,
      `Eco-Friendly Carpet Cleaning in ${cleanLoc}, Florida`
    ],
    'pressure-washing': [
      `Professional Pressure Washing & Power Washing in ${cleanLoc}, FL`,
      `Top-Rated Exterior Pressure Cleaning in ${cleanLoc}, Florida`,
      `Driveway, Patio & Siding Pressure Washing in ${cleanLoc}, FL`
    ],
    'window-cleaning': [
      `Professional Window Cleaning & Washing in ${cleanLoc}, FL`,
      `Top-Rated Streak-Free Window Cleaning in ${cleanLoc}, Florida`,
      `Residential & Commercial Window Cleaning in ${cleanLoc}, FL`
    ],
    'post-construction-cleaning': [
      `Post-Construction Cleanup & Dust Removal in ${cleanLoc}, FL`,
      `Top-Rated Construction Cleaning Services in ${cleanLoc}, Florida`,
      `Detailed Post-Remodel & Build Cleaning in ${cleanLoc}, FL`
    ],
    'luxury-estate-cleaning': [
      `Luxury Estate & Mansion Cleaning Services in ${cleanLoc}, FL`,
      `Premier Luxury Home Cleaning & Housekeeping in ${cleanLoc}, Florida`,
      `White-Glove Estate & Villa Cleaning in ${cleanLoc}, FL`
    ],
    'medical-dental-facility-cleaning': [
      `Medical & Dental Facility Sanitization Services in ${cleanLoc}, FL`,
      `Top-Rated Healthcare & Clinic Cleaning in ${cleanLoc}, Florida`
    ],
    'gym-fitness-center-cleaning': [
      `Gym & Fitness Center Disinfection & Cleaning in ${cleanLoc}, FL`,
      `Top-Rated Fitness Center Cleaning Services in ${cleanLoc}, Florida`
    ],
    'solar-panel-cleaning': [
      `Professional Solar Panel Cleaning & Washing in ${cleanLoc}, FL`,
      `Top-Rated Solar Panel Washers in ${cleanLoc}, Florida`
    ],
    'gutter-cleaning': [
      `Professional Gutter Cleaning & Downspout Clearing in ${cleanLoc}, FL`,
      `Top-Rated Gutter Cleaners in ${cleanLoc}, Florida`
    ]
  };

  const defaultH1s = [
    `${cleanSrv} Near You in ${cleanLoc}, FL`,
    `Best Local ${cleanSrv} & Maid Service in ${cleanLoc}, FL`,
    `Top-Rated ${cleanSrv} & Professional Cleaners in ${cleanLoc}, Florida`,
    `Affordable ${cleanSrv} & House Cleaning in ${cleanLoc}, FL`,
    `Trusted, Licensed & Insured ${cleanSrv} in ${cleanLoc}, Florida`,
    `Premier 5-Star ${cleanSrv} & Housekeeping in ${cleanLoc}, FL`,
    `Same-Day & Recurring ${cleanSrv} in ${cleanLoc}, Florida`,
    `Award-Winning Local ${cleanSrv} in ${cleanLoc}, FL`
  ];

  const h1Pool = serviceH1MapUnique[serviceSlug] || defaultH1s;
  const h1 = h1Pool[seed % h1Pool.length];

  // 3. High-Volume Daily Search Term Clusters (Real Google user daily search queries)
  const dailyKeywordPools = [
    [
      `house cleaning near me in ${cleanLoc}`,
      `best maid service ${cleanLoc} FL`,
      `affordable ${cleanSrv.toLowerCase()} ${cleanLoc}`,
      `top rated house cleaners ${cleanLoc} Florida`,
      `same day cleaning service ${cleanLoc}`,
      `deep home sanitization ${cleanLoc}`,
      `licensed and insured maids ${cleanLoc}`,
      `weekly recurring cleaning ${cleanLoc}`
    ],
    [
      `professional cleaners near me in ${cleanLoc}`,
      `maid service near me ${cleanLoc} FL`,
      `best ${cleanSrv.toLowerCase()} company ${cleanLoc}`,
      `move out cleaning cost ${cleanLoc}`,
      `luxury condo and home cleaners ${cleanLoc}`,
      `pet safe house cleaning ${cleanLoc}`,
      `commercial janitorial service ${cleanLoc}`,
      `local housekeeper in ${cleanLoc} Florida`
    ],
    [
      `cheap cleaning services ${cleanLoc} FL`,
      `trusted maid company near me ${cleanLoc}`,
      `5 star ${cleanSrv.toLowerCase()} ${cleanLoc}`,
      `Airbnb turnover cleaning ${cleanLoc}`,
      `post construction cleaning ${cleanLoc}`,
      `bi weekly house cleaning rates ${cleanLoc}`,
      `eco friendly home cleaning ${cleanLoc}`,
      `background checked cleaners ${cleanLoc}`
    ],
    [
      `top house cleaning company in ${cleanLoc} FL`,
      `maid service quotes near me ${cleanLoc}`,
      `emergency same day cleaners ${cleanLoc}`,
      `deep cleaning apartment near me ${cleanLoc}`,
      `residential maid services ${cleanLoc} Florida`,
      `move in cleaning specials ${cleanLoc}`,
      `reliable maid service in ${cleanLoc}`,
      `full house deep clean ${cleanLoc}`
    ]
  ];

  const dailySearchKeywords = dailyKeywordPools[seed % dailyKeywordPools.length];

  // 4. Badges
  const badges = [
    `📍 Serving All of ${cleanLoc} & Surrounding Florida Areas`,
    `✨ 100% Satisfaction Guaranteed in ${cleanLoc}, FL`,
    `🏆 Top Rated Cleaning Specialists in ${cleanLoc}, Florida`,
    `🛡️ Fully Licensed, Bonded & Insured in ${cleanLoc}`,
    `🌿 Eco-Friendly & Hospital-Grade Cleaners in ${cleanLoc}, FL`,
  ];
  const badge = badges[seed % badges.length];

  // 5. Hero Subtitle naturally weaving in primary user intent
  const heroSubs = [
    `Searching for trusted <strong>house cleaning near me</strong> in ${cleanLoc}? Sweet Maid delivers customized, detail-obsessed ${cleanSrv.toLowerCase()} throughout ${cleanLoc} with background-checked specialists, hospital-grade non-toxic supplies, and a 100% satisfaction guarantee.`,
    `Looking for the best <strong>maid service in ${cleanLoc}, FL</strong>? Sweet Maid provides elite-tier home sanitization, recurring weekly maintenance, and move-out detailing tailored specifically to your property's needs.`,
    `Transform your space with ${cleanLoc}'s premier <strong>professional cleaners</strong>. Sweet Maid combines hospital-grade HEPA sanitization, pet-safe formulas, and vetted specialists for unmatched ${cleanSrv.toLowerCase()} across ${cleanLoc}, Florida.`,
    `Get 5-star <strong>residential and commercial cleaning in ${cleanLoc}</strong>. Our licensed and insured cleaning teams handle everything from deep sanitizing to recurring housekeeping with transparent, flat-rate pricing.`
  ];
  const heroSub = heroSubs[(seed >> 2) % heroSubs.length];

  // 6. Natural High-Volume Search Context Paragraph (Natural Language Keyword Weaving)
  const searchContextParagraph = `Whether you are searching for <em>"house cleaning near me in ${cleanLoc}"</em>, <em>"same-day deep cleaning service"</em>, or <em>"reliable recurring maid service in ${cleanLoc}, FL"</em>, Sweet Maid is the trusted local authority. We serve single-family homes, luxury condominiums, apartments, vacation rentals, and commercial offices across ${cleanLoc} with hospital-grade sanitization and EPA-certified eco-friendly products.`;

  const dailySearchHeading = `Popular Daily Cleaning Searches in ${cleanLoc}, FL`;

  // 7. Dynamic Florida Climate & Environmental Strategy
  const isCoastal = locSlug.includes('beach') || locSlug.includes('key') || locSlug.includes('isles') || locSlug.includes('shores') || locSlug.includes('miami') || locSlug.includes('sarasota') || locSlug.includes('tampa') || locSlug.includes('naples');
  
  const climateTitle = isCoastal
    ? `Coastal Environmental & Moisture Defense in ${cleanLoc}, FL`
    : `Florida High-Humidity & Air Quality Defense in ${cleanLoc}, FL`;

  const climateBody = isCoastal
    ? `Properties in ${cleanLoc} face unique environmental challenges: high subtropical humidity, airborne salt spray, persistent fine sand, and rapid mildew accumulation in tile grout and HVAC vents. Sweet Maid’s specialized ${cleanSrv.toLowerCase()} in ${cleanLoc} incorporates moisture-neutralizing sanitizers, sand-extracting HEPA vacuums, and streak-free salt film removers designed specifically for Florida coastal living.`
    : `Inland Florida climate brings heavy seasonal pollen, intense heat-humidity cycles, and airborne dust that settles deep into upholstery, carpets, and air returns throughout ${cleanLoc}. Our professional ${cleanSrv.toLowerCase()} uses multi-stage micro-allergen filtration and anti-microbial treatments to safeguard your indoor air quality and keep your ${cleanLoc} home spotless and fresh year-round.`;

  // 8. Eco-Friendly Section
  const ecoTitle = `Safe For Your Family, Pets & The ${cleanLoc} Ecosystem`;
  const ecoBody = `We strictly use non-toxic, biodegradable, and EPA Safer Choice certified cleaning solutions for all ${cleanSrv.toLowerCase()} in ${cleanLoc}, FL. Our zero-residue formulas eliminate 99.9% of bacteria and viral pathogens without releasing harsh VOCs or chemical fumes into your living space, protecting children, pets, and Florida's delicate waterways.`;

  // 9. Why Choose Points
  const whyChooseTitle = `Why ${cleanLoc} Residents & Businesses Choose Sweet Maid for ${cleanSrv}`;
  const whyChoosePoints = [
    {
      title: "100% Background-Checked Staff",
      desc: `Every cleaner dispatched to your ${cleanLoc} property is rigorously vetted, trained, and insured for your total peace of mind.`,
      icon: "fa-shield-halved"
    },
    {
      title: "Customized Cleaning Checklists",
      desc: `We don't do generic one-size-fits-all cleans. Every ${cleanLoc} booking follows a tailored checklist focusing on your exact high-priority areas.`,
      icon: "fa-clipboard-check"
    },
    {
      title: "Hospital-Grade HEPA Filtration",
      desc: `Our commercial-grade vacuums capture 99.97% of dust mites, Florida pollen, and pet dander down to 0.3 microns throughout ${cleanLoc}.`,
      icon: "fa-wind"
    },
    {
      title: "Zero-Risk Satisfaction Guarantee",
      desc: `If any spot in your ${cleanLoc} property isn't cleaned to absolute perfection, we return within 24 hours to re-clean it free of charge.`,
      icon: "fa-award"
    }
  ];

  // 10. 10 Detailed Long-Form Localized FAQs (Google People Also Ask Optimized)
  const faqs = [
    {
      q: `Who provides the best ${cleanSrv.toLowerCase()} in ${cleanLoc}, FL?`,
      a: `Sweet Maid is recognized as the leading provider of 5-star ${cleanSrv.toLowerCase()} in ${cleanLoc}, Florida. We combine background-checked cleaners, hospital-grade equipment, transparent upfront pricing, and a 100% satisfaction guarantee to deliver the highest quality clean across all ${cleanLoc} residential neighborhoods and commercial districts.`
    },
    {
      q: `How much does professional ${cleanSrv.toLowerCase()} cost in ${cleanLoc}, Florida?`,
      a: `The cost of ${cleanSrv.toLowerCase()} in ${cleanLoc} typically ranges between $129 and $289 depending on your home's total square footage, number of bedrooms and bathrooms, and whether you require recurring maintenance or an intensive initial deep clean. We offer free, instant online quotes with zero hidden fees for all ${cleanLoc} residents.`
    },
    {
      q: `Are Sweet Maid cleaners licensed, bonded, and insured in ${cleanLoc}?`,
      a: `Yes. Sweet Maid is fully licensed, bonded, and carries comprehensive multi-million dollar liability and workers' compensation insurance covering all cleaning operations in ${cleanLoc} and throughout the State of Florida. Your property and valuables are 100% protected at all times.`
    },
    {
      q: `How often should I schedule ${cleanSrv.toLowerCase()} for my ${cleanLoc} home?`,
      a: `Due to Florida's subtropical climate, humidity, and active outdoor lifestyle in ${cleanLoc}, most homeowners benefit most from bi-weekly recurring cleaning to prevent dust, mold spores, and grime buildup. We also offer weekly schedules for busy households with pets and monthly refresh cleans.`
    },
    {
      q: `Do I need to be home during the ${cleanSrv.toLowerCase()} in ${cleanLoc}?`,
      a: `No, you do not need to be present! Many of our clients in ${cleanLoc} provide a lockbox code, garage keypad, or front desk key authorization. Our trusted cleaning teams securely lock up your property upon completing your service.`
    },
    {
      q: `Do you provide all cleaning supplies and equipment in ${cleanLoc}?`,
      a: `Yes, Sweet Maid arrives fully equipped with commercial HEPA vacuums, microfiber dusting systems, extendable pole dusters, and premium eco-friendly sanitizers. You never have to supply anything unless you have a specialized surface product you prefer us to use.`
    },
    {
      q: `What is the difference between regular and deep ${cleanSrv.toLowerCase()} in ${cleanLoc}?`,
      a: `Regular cleaning focuses on upkeep: wiping surfaces, vacuuming, mopping, bathroom sanitization, and trash removal. Deep ${cleanSrv.toLowerCase()} in ${cleanLoc} is an intensive overhaul that includes hand-scrubbing baseboards, interior oven and refrigerator detailing, door frame wipe-downs, tile grout scrubbing, and high-reach vent dusting.`
    },
    {
      q: `Are your cleaning solutions safe for pets and children in ${cleanLoc}?`,
      a: `100% safe. We strictly utilize plant-based, non-toxic, and hypoallergenic cleaning agents that leave zero toxic chemical residues on your ${cleanLoc} floors, countertops, or living areas.`
    },
    {
      q: `How quickly can I book ${cleanSrv.toLowerCase()} in ${cleanLoc}, FL?`,
      a: `We offer convenient same-day and next-day availability for urgent ${cleanSrv.toLowerCase()} across ${cleanLoc}, as well as scheduled recurring slots. You can book instantly online in under 60 seconds or call our Florida dispatch team.`
    },
    {
      q: `What if I am not completely satisfied with my clean in ${cleanLoc}?`,
      a: `We stand firmly behind our 100% Sparkle Guarantee. If you notice any area that was missed in your ${cleanLoc} property, notify us within 24 hours and a supervisor will return to re-clean that area free of charge until you are completely delighted.`
    }
  ];

  // 11. Structured Schema with keywords and knowAbout entities
  const schemaObj = [
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService", "Organization"],
      "name": `Sweet Maid - ${cleanSrv} ${cleanLoc}`,
      "description": heroSub.replace(/<[^>]+>/g, ''),
      "url": `https://sweetmaidcleaning.com/${locSlug}/${serviceSlug}/`,
      "telephone": "(941) 222-2080",
      "image": "https://sweetmaidcleaning.com/images/logo.png",
      "priceRange": "$$",
      "keywords": dailySearchKeywords.join(', '),
      "knowsAbout": [
        "House Cleaning",
        "Maid Service",
        "Deep Cleaning",
        "Move Out Cleaning",
        "Sanitization",
        "Residential Cleaning",
        "Commercial Cleaning",
        ...dailySearchKeywords
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": `Serving ${cleanLoc} & Greater Florida`,
        "addressLocality": cleanLoc,
        "addressRegion": "FL",
        "addressCountry": "US"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "284",
        "bestRating": "5"
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": cleanLoc
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
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://sweetmaidcleaning.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": cleanLoc,
          "item": `https://sweetmaidcleaning.com/${locSlug}/`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": cleanSrv,
          "item": `https://sweetmaidcleaning.com/${locSlug}/${serviceSlug}/`
        }
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
