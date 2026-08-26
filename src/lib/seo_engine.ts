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
  heroSub: string;
  badge: string;
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

  // Variations for H1 to prevent any duplicate patterns
  const h1Templates = [
    `#1 Top-Rated ${cleanSrv} in ${cleanLoc}, FL`,
    `Premier 5-Star ${cleanSrv} in ${cleanLoc}, Florida`,
    `Best Local ${cleanSrv} & Professional Cleaners in ${cleanLoc}, FL`,
    `Award-Winning ${cleanSrv} & Maid Service in ${cleanLoc}, FL`,
    `Trusted, Licensed & Insured ${cleanSrv} in ${cleanLoc}, Florida`,
    `Meticulous & Affordable ${cleanSrv} in ${cleanLoc}, FL`,
  ];
  const h1 = h1Templates[seed % h1Templates.length];

  // Variations for Badges
  const badges = [
    `📍 Serving All of ${cleanLoc} & Surrounding Florida Areas`,
    `✨ 100% Satisfaction Guaranteed in ${cleanLoc}, FL`,
    `🏆 Top Rated Cleaning Specialists in ${cleanLoc}, Florida`,
    `🛡️ Fully Licensed, Bonded & Insured in ${cleanLoc}`,
    `🌿 Eco-Friendly & Hospital-Grade Cleaners in ${cleanLoc}, FL`,
  ];
  const badge = badges[seed % badges.length];

  // Variations for Hero Subtitles
  const heroSubs = [
    `Experience Florida's highest standard of residential and commercial cleanliness. Sweet Maid delivers customized, detail-obsessed ${cleanSrv.toLowerCase()} throughout ${cleanLoc} with vetted professionals, non-toxic hospital-grade supplies, and a 100% sparkle guarantee.`,
    `Looking for the most reliable ${cleanSrv.toLowerCase()} in ${cleanLoc}, FL? Sweet Maid provides elite-tier sanitization, recurring maintenance, and deep detailing tailored specifically to your Florida property's needs.`,
    `Transform your space into a pristine sanctuary with ${cleanLoc}'s trusted cleaning authority. Sweet Maid combines hospital-grade HEPA sanitization, eco-friendly formulas, and background-checked specialists for unmatched ${cleanSrv.toLowerCase()}.`,
  ];
  const heroSub = heroSubs[(seed >> 2) % heroSubs.length];

  // Dynamic Florida Climate & Environmental Cleaning Strategy
  const isCoastal = locSlug.includes('beach') || locSlug.includes('key') || locSlug.includes('isles') || locSlug.includes('shores') || locSlug.includes('miami') || locSlug.includes('sarasota') || locSlug.includes('tampa') || locSlug.includes('naples');
  
  const climateTitle = isCoastal
    ? `Coastal Environmental & Moisture Defense in ${cleanLoc}, FL`
    : `Florida High-Humidity & Air Quality Defense in ${cleanLoc}, FL`;

  const climateBody = isCoastal
    ? `Properties in ${cleanLoc} face unique environmental challenges: high subtropical humidity, airborne salt spray, persistent fine sand, and rapid mildew accumulation in tile grout and HVAC vents. Sweet Maid’s specialized ${cleanSrv.toLowerCase()} in ${cleanLoc} incorporates moisture-neutralizing sanitizers, sand-extracting HEPA vacuums, and streak-free salt film removers designed specifically for Florida coastal living.`
    : `Inland Florida climate brings heavy seasonal pollen, intense heat-humidity cycles, and airborne dust that settles deep into upholstery, carpets, and air returns throughout ${cleanLoc}. Our professional ${cleanSrv.toLowerCase()} uses multi-stage micro-allergen filtration and anti-microbial treatments to safeguard your indoor air quality and keep your ${cleanLoc} home spotless and fresh year-round.`;

  // Eco-Friendly Section
  const ecoTitle = `Safe For Your Family, Pets & The ${cleanLoc} Ecosystem`;
  const ecoBody = `We strictly use non-toxic, biodegradable, and EPA Safer Choice certified cleaning solutions for all ${cleanSrv.toLowerCase()} in ${cleanLoc}, FL. Our zero-residue formulas eliminate 99.9% of bacteria and viral pathogens without releasing harsh VOCs or chemical fumes into your living space, protecting children, pets, and Florida's delicate waterways.`;

  // Dynamic Why Choose Points
  const whyChooseTitle = `Why ${cleanLoc} Residents & Businesses Choose Sweet Maid for ${cleanSrv}`;
  const whyChoosePoints = [
    {
      title: "100% Background-Checked Staff",
      desc: `Every cleaner dispatched to your ${cleanLoc} property is rigorously vetted, trained, and insured for your total peace of mind.`,
      icon: "fa-shield-check"
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

  // 10 Detailed Long-Form Localized FAQs for Google & AI Search Overviews
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

  // Dynamic Structured JSON-LD Schema
  const schemaObj = [
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService", "Organization"],
      "name": `Sweet Maid - ${cleanSrv} ${cleanLoc}`,
      "description": heroSub,
      "url": `https://sweetmaidcleaning.com/${locSlug}/${serviceSlug}/`,
      "telephone": "(941) 222-2080",
      "image": "https://sweetmaidcleaning.com/images/logo.png",
      "priceRange": "$$",
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
    heroSub,
    badge,
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
