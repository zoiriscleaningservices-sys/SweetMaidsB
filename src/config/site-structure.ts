/**
 * SWEET MAID CLEANING SERVICE: Single Source of Truth Configuration
 * As mandated by Master Prompt v3 (Section 7).
 *
 * All routes, navigation, footer, /locations/, sitemap, robots meta,
 * internal links, and schemas read from this single file.
 */

export const CANONICAL_HOST = 'https://www.sweetmaidcleaning.com';
export const APEX_HOST = 'https://sweetmaidcleaning.com';

// 1. Business Info
export const BUSINESS_INFO = {
  name: 'Sweet Maid Cleaning Service',
  legalName: 'Sweet Maid Cleaning Service',
  phone: '(941) 222-2080',
  phoneFormatted: '(941) 222-2080',
  email: 'info@sweetmaidcleaning.com',
  hours: 'Mon-Sat 8AM-6PM',
  homeBaseCity: 'Bradenton',
  homeBaseCounty: 'Manatee County',
  socialProfiles: [
    'https://www.facebook.com/SweetMaidCleaningService/',
    'https://www.instagram.com/sweetmaidcleaningservice/',
    'https://www.tiktok.com/@sweetmaidcleaningservice',
    'https://www.youtube.com/@sweetmaidcleaning',
    'https://www.linkedin.com/company/sweet-maid-cleaning-service/',
    'https://www.pinterest.com/sweetmaidcleaning/',
    'https://x.com/sweetmaidclean',
    'https://www.yelp.com/biz/sweet-maid-cleaning-service-bradenton-3'
  ],
  whatsAppUrl: 'https://wa.me/16452176738',
  defaultOgImage: '/images/logo.png'
};

// 2. Pricing ("from", USD, matching Google profile exactly)
export const PRICING_FROM = {
  standard_cleaning: 180,
  deep_clean: 250,
  move_out: 350,
  airbnb: 250,
  post_construction: 350,
  one_time: 250,
  office_workplace: 200
};

// 3. Approved 24 Services
export const SERVICES = [
  'house-cleaning',
  'deep-cleaning',
  'recurring-maid-service',
  'move-in-out-cleaning',
  'airbnb-cleaning',
  'home-watch-services',
  'luxury-estate-cleaning',
  'property-management-janitorial',
  'commercial-cleaning',
  'office-janitorial-services',
  'janitorial-cleaning-services',
  'medical-dental-facility-cleaning',
  'industrial-warehouse-cleaning',
  'gym-fitness-center-cleaning',
  'school-daycare-cleaning',
  'church-worship-center-cleaning',
  'post-construction-cleaning',
  'pressure-washing',
  'carpet-cleaning',
  'window-cleaning',
  'floor-stripping-waxing',
  'solar-panel-cleaning',
  'gutter-cleaning',
  'property-maintenance'
] as const;

export type ServiceSlug = typeof SERVICES[number];

// 4. Core Services (10 indexed at launch, matching Google Business Profile)
export const CORE_SERVICES: readonly ServiceSlug[] = [
  'house-cleaning',
  'deep-cleaning',
  'recurring-maid-service',
  'move-in-out-cleaning',
  'airbnb-cleaning',
  'post-construction-cleaning',
  'commercial-cleaning',
  'carpet-cleaning',
  'window-cleaning',
  'janitorial-cleaning-services'
];

export function isCoreService(service: string): boolean {
  return (CORE_SERVICES as readonly string[]).includes(service);
}

// 5. Site / General Pages (9)
export const SITE_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily', indexed: true },
  { path: '/services/', priority: '0.9', changefreq: 'weekly', indexed: true },
  { path: '/locations/', priority: '0.9', changefreq: 'daily', indexed: true },
  { path: '/about/', priority: '0.8', changefreq: 'monthly', indexed: true },
  { path: '/blog/', priority: '0.8', changefreq: 'weekly', indexed: true },
  { path: '/gallery/', priority: '0.8', changefreq: 'monthly', indexed: true },
  { path: '/book-online/', priority: '1.0', changefreq: 'daily', indexed: true },
  { path: '/privacy-policy/', priority: '0.3', changefreq: 'yearly', indexed: true },
  { path: '/terms-and-conditions/', priority: '0.3', changefreq: 'yearly', indexed: true },
  { path: '/login/', priority: '0.1', changefreq: 'monthly', indexed: false } // noindex, not in sitemap
];

// 6. 17 Regions
export interface RegionConfig {
  slug: string; // e.g. '/' or 'sarasota-fl' or 'monroe-county'
  county: string;
  name: string;
  ready: boolean;
  phone: string;
  placesServed: string[];
}

export const REGIONS: Record<string, RegionConfig> = {
  manatee: {
    slug: '', // targets root '/'
    county: 'Manatee County',
    name: 'Manatee County (Bradenton Base)',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: [
      'Bradenton', 'Lakewood Ranch', 'Longboat Key', 'Palmetto', 'Ellenton',
      'Parrish', 'Anna Maria', 'Holmes Beach', 'Bradenton Beach', 'Cortez',
      'Bayshore Gardens', 'Whitfield', 'Terra Ceia', 'Tallevast', 'Myakka City'
    ]
  },
  sarasota: {
    slug: 'sarasota-fl',
    county: 'Sarasota County',
    name: 'Sarasota County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: [
      'Sarasota', 'Venice', 'South Venice', 'North Port', 'Osprey', 'Nokomis',
      'Siesta Key', 'Longboat Key', 'Lakewood Ranch', 'Fruitville', 'Lake Sarasota',
      'Bee Ridge', 'Palmer Ranch', 'Gulf Gate Estates', 'Englewood'
    ]
  },
  miami_dade: {
    slug: 'miami-fl',
    county: 'Miami-Dade County',
    name: 'Miami-Dade County',
    ready: true,
    phone: '(305) 851-6959',
    placesServed: [
      'Miami', 'Homestead', 'Miami Beach', 'Coral Gables', 'Doral', 'Aventura',
      'Kendall', 'Pinecrest', 'Key Biscayne', 'South Miami', 'Bal Harbour',
      'Sunny Isles Beach', 'Cutler Bay', 'Palmetto Bay', 'Hialeah'
    ]
  },
  monroe: {
    slug: 'monroe-county',
    county: 'Monroe County',
    name: 'Florida Keys & Monroe County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: [
      'Key Largo', 'North Key Largo', 'Tavernier', 'Islamorada', 'Marathon',
      'Key West', 'Big Pine Key', 'Duck Key', 'Layton', 'Key Colony Beach', 'Stock Island'
    ]
  },
  hillsborough: {
    slug: 'tampa-fl',
    county: 'Hillsborough County',
    name: 'Hillsborough County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: [
      'Tampa', 'Fish Hawk', 'Lithia', 'Brandon', 'Riverview', 'Valrico',
      'Bloomingdale', 'Plant City', 'Temple Terrace', 'Sun City Center',
      'Apollo Beach', 'Ruskin', 'Lutz', 'Carrollwood', 'Westchase'
    ]
  },
  pinellas: {
    slug: 'st-petersburg-fl',
    county: 'Pinellas County',
    name: 'Pinellas County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: [
      'St. Petersburg', 'Clearwater', 'Largo', 'Palm Harbor', 'Dunedin',
      'Tarpon Springs', 'Pinellas Park', 'Safety Harbor', 'Seminole', 'Gulfport',
      'Oldsmar', 'St. Pete Beach', 'Treasure Island'
    ]
  },
  broward: {
    slug: 'fort-lauderdale-fl',
    county: 'Broward County',
    name: 'Broward County',
    ready: false,
    phone: '(305) 851-6959',
    placesServed: ['Fort Lauderdale', 'Hollywood', 'Pompano Beach', 'Coral Springs', 'Pembroke Pines']
  },
  palm_beach: {
    slug: 'west-palm-beach-fl',
    county: 'Palm Beach County',
    name: 'Palm Beach County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['West Palm Beach', 'Boca Raton', 'Boynton Beach', 'Delray Beach', 'Wellington', 'Jupiter']
  },
  collier: {
    slug: 'naples-fl',
    county: 'Collier County',
    name: 'Collier County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['Naples', 'Marco Island', 'Immokalee', 'Golden Gate', 'Naples Park', 'Pelican Bay']
  },
  lee: {
    slug: 'fort-myers-fl',
    county: 'Lee County',
    name: 'Lee County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['Fort Myers', 'Cape Coral', 'Bonita Springs', 'Estero', 'Lehigh Acres', 'Fort Myers Beach', 'Sanibel']
  },
  charlotte: {
    slug: 'port-charlotte-fl',
    county: 'Charlotte County',
    name: 'Charlotte County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['Port Charlotte', 'Punta Gorda', 'Englewood', 'Rotonda West', 'Babcock Ranch']
  },
  pasco: {
    slug: 'pasco-county',
    county: 'Pasco County',
    name: 'Pasco County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['New Port Richey', 'Wesley Chapel', 'Land O Lakes', 'Zephyrhills', 'Dade City', 'Odessa']
  },
  orange: {
    slug: 'orlando-fl',
    county: 'Orange County',
    name: 'Orange County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['Orlando', 'Winter Park', 'Ocoee', 'Winter Garden', 'Apopka', 'Windermere', 'Maitland']
  },
  duval: {
    slug: 'jacksonville-fl',
    county: 'Duval County',
    name: 'Duval County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['Jacksonville', 'Jacksonville Beach', 'Atlantic Beach', 'Neptune Beach', 'Baldwin']
  },
  alachua: {
    slug: 'gainesville-fl',
    county: 'Alachua County',
    name: 'Alachua County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['Gainesville', 'Alachua', 'High Springs', 'Newberry', 'Hawthorne']
  },
  escambia: {
    slug: 'pensacola-fl',
    county: 'Escambia County',
    name: 'Escambia County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['Pensacola', 'Pensacola Beach', 'Perdido Key', 'Brent', 'Ensley', 'Ferry Pass']
  },
  bay: {
    slug: 'panama-city-fl',
    county: 'Bay County',
    name: 'Bay County',
    ready: false,
    phone: '(941) 222-2080',
    placesServed: ['Panama City', 'Panama City Beach', 'Lynn Haven', 'Callaway', 'Springfield']
  }
};

// 7. Approved 61 City Pages (Under 80 Cap)
export interface CityConfig {
  slug: string; // e.g. 'lakewood-ranch-fl'
  name: string;
  county: string;
  hasOfficeOrTeam: boolean;
  nearestBaseDistance: string;
  mergedPlaces?: string[];
}

export const CITY_PAGES: Record<string, CityConfig> = {
  // Manatee (Bradenton is home base -> /)
  'lakewood-ranch-fl': { slug: 'lakewood-ranch-fl', name: 'Lakewood Ranch', county: 'Manatee / Sarasota County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Local Office)' },
  'palmetto-fl': { slug: 'palmetto-fl', name: 'Palmetto', county: 'Manatee County', hasOfficeOrTeam: false, nearestBaseDistance: '5 miles to Bradenton HQ' },
  'ellenton-fl': { slug: 'ellenton-fl', name: 'Ellenton', county: 'Manatee County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Bradenton HQ' },
  'parrish-fl': { slug: 'parrish-fl', name: 'Parrish', county: 'Manatee County', hasOfficeOrTeam: true, nearestBaseDistance: '12 miles to Bradenton HQ (Planned Staff)' },
  'anna-maria-fl': { slug: 'anna-maria-fl', name: 'Anna Maria', county: 'Manatee County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Bradenton HQ' },
  'holmes-beach-fl': { slug: 'holmes-beach-fl', name: 'Holmes Beach', county: 'Manatee County', hasOfficeOrTeam: false, nearestBaseDistance: '11 miles to Bradenton HQ' },
  'bradenton-beach-fl': { slug: 'bradenton-beach-fl', name: 'Bradenton Beach', county: 'Manatee County', hasOfficeOrTeam: false, nearestBaseDistance: '9 miles to Bradenton HQ' },
  'cortez-fl': { slug: 'cortez-fl', name: 'Cortez', county: 'Manatee County', hasOfficeOrTeam: false, nearestBaseDistance: '7 miles to Bradenton HQ' },
  'bayshore-gardens-fl': { slug: 'bayshore-gardens-fl', name: 'Bayshore Gardens', county: 'Manatee County', hasOfficeOrTeam: false, nearestBaseDistance: '4 miles to Bradenton HQ' },
  'whitfield-fl': { slug: 'whitfield-fl', name: 'Whitfield', county: 'Manatee County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Bradenton HQ' },
  'longboat-key-fl': { slug: 'longboat-key-fl', name: 'Longboat Key', county: 'Manatee / Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to Bradenton HQ' },
  'myakka-city-fl': { slug: 'myakka-city-fl', name: 'Myakka City', county: 'Manatee County', hasOfficeOrTeam: false, nearestBaseDistance: '22 miles to Bradenton HQ' },

  // Sarasota
  'sarasota-fl': { slug: 'sarasota-fl', name: 'Sarasota', county: 'Sarasota County', hasOfficeOrTeam: true, nearestBaseDistance: '12 miles to Bradenton HQ (Planned Staff)' },
  'venice-fl': { slug: 'venice-fl', name: 'Venice (incl. South Venice)', county: 'Sarasota County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Venice Office)', mergedPlaces: ['South Venice'] },
  'north-port-fl': { slug: 'north-port-fl', name: 'North Port', county: 'Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Venice Office' },
  'osprey-fl': { slug: 'osprey-fl', name: 'Osprey', county: 'Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Venice Office' },
  'nokomis-fl': { slug: 'nokomis-fl', name: 'Nokomis', county: 'Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '3 miles to Venice Office' },
  'siesta-key-fl': { slug: 'siesta-key-fl', name: 'Siesta Key', county: 'Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to Bradenton HQ' },
  'fruitville-fl': { slug: 'fruitville-fl', name: 'Fruitville', county: 'Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Bradenton HQ' },
  'lake-sarasota-fl': { slug: 'lake-sarasota-fl', name: 'Lake Sarasota', county: 'Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to Bradenton HQ' },
  'bee-ridge-fl': { slug: 'bee-ridge-fl', name: 'Bee Ridge', county: 'Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to Bradenton HQ' },
  'palmer-ranch-fl': { slug: 'palmer-ranch-fl', name: 'Palmer Ranch', county: 'Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to Bradenton HQ' },
  'englewood-fl': { slug: 'englewood-fl', name: 'Englewood', county: 'Sarasota County', hasOfficeOrTeam: false, nearestBaseDistance: '12 miles to Venice Office' },

  // Miami-Dade
  'miami-fl': { slug: 'miami-fl', name: 'Miami', county: 'Miami-Dade County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Miami Office)' },
  'homestead-fl': { slug: 'homestead-fl', name: 'Homestead', county: 'Miami-Dade County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Homestead Office)' },
  'miami-beach-fl': { slug: 'miami-beach-fl', name: 'Miami Beach', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Miami Office' },
  'coral-gables-fl': { slug: 'coral-gables-fl', name: 'Coral Gables', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '4 miles to Miami Office' },
  'doral-fl': { slug: 'doral-fl', name: 'Doral', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '10 miles to Miami Office' },
  'aventura-fl': { slug: 'aventura-fl', name: 'Aventura', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to Miami Office' },
  'kendall-fl': { slug: 'kendall-fl', name: 'Kendall', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '9 miles to Miami Office' },
  'pinecrest-fl': { slug: 'pinecrest-fl', name: 'Pinecrest', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '11 miles to Miami Office' },
  'key-biscayne-fl': { slug: 'key-biscayne-fl', name: 'Key Biscayne', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '8 miles to Miami Office' },
  'south-miami-fl': { slug: 'south-miami-fl', name: 'South Miami', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '7 miles to Miami Office' },
  'bal-harbour-fl': { slug: 'bal-harbour-fl', name: 'Bal Harbour', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Miami Office' },
  'sunny-isles-beach-fl': { slug: 'sunny-isles-beach-fl', name: 'Sunny Isles Beach', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to Miami Office' },
  'cutler-bay-fl': { slug: 'cutler-bay-fl', name: 'Cutler Bay', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to Miami Office' },
  'palmetto-bay-fl': { slug: 'palmetto-bay-fl', name: 'Palmetto Bay', county: 'Miami-Dade County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Miami Office' },

  // Monroe / Keys
  'key-largo-fl': { slug: 'key-largo-fl', name: 'Key Largo (incl. North Key Largo)', county: 'Monroe County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Key Largo Team)', mergedPlaces: ['North Key Largo'] },
  'tavernier-fl': { slug: 'tavernier-fl', name: 'Tavernier', county: 'Monroe County', hasOfficeOrTeam: false, nearestBaseDistance: '10 miles to Key Largo Base' },
  'islamorada-fl': { slug: 'islamorada-fl', name: 'Islamorada', county: 'Monroe County', hasOfficeOrTeam: false, nearestBaseDistance: '17 miles to Key Largo Base' },
  'marathon-fl': { slug: 'marathon-fl', name: 'Marathon', county: 'Monroe County', hasOfficeOrTeam: false, nearestBaseDistance: '48 miles to Key Largo Base' },
  'big-pine-key-fl': { slug: 'big-pine-key-fl', name: 'Big Pine Key', county: 'Monroe County', hasOfficeOrTeam: false, nearestBaseDistance: '75 miles to Key Largo Base' },
  'key-west-fl': { slug: 'key-west-fl', name: 'Key West', county: 'Monroe County', hasOfficeOrTeam: false, nearestBaseDistance: '98 miles to Key Largo Base' },

  // Hillsborough
  'tampa-fl': { slug: 'tampa-fl', name: 'Tampa', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: 'Hillsborough Regional Center' },
  'fish-hawk-fl': { slug: 'fish-hawk-fl', name: 'Fish Hawk (incl. Lithia)', county: 'Hillsborough County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Fish Hawk Team)', mergedPlaces: ['Lithia'] },
  'brandon-fl': { slug: 'brandon-fl', name: 'Brandon', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '8 miles to Fish Hawk Base' },
  'riverview-fl': { slug: 'riverview-fl', name: 'Riverview', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '7 miles to Fish Hawk Base' },
  'valrico-fl': { slug: 'valrico-fl', name: 'Valrico', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Fish Hawk Base' },
  'bloomingdale-fl': { slug: 'bloomingdale-fl', name: 'Bloomingdale', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '5 miles to Fish Hawk Base' },
  'apollo-beach-fl': { slug: 'apollo-beach-fl', name: 'Apollo Beach', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Fish Hawk Base' },
  'sun-city-center-fl': { slug: 'sun-city-center-fl', name: 'Sun City Center', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to Fish Hawk Base' },
  'plant-city-fl': { slug: 'plant-city-fl', name: 'Plant City', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to Fish Hawk Base' },
  'carrollwood-fl': { slug: 'carrollwood-fl', name: 'Carrollwood', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '8 miles to Tampa' },
  'westchase-fl': { slug: 'westchase-fl', name: 'Westchase', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '12 miles to Tampa' },
  'lutz-fl': { slug: 'lutz-fl', name: 'Lutz', county: 'Hillsborough County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Tampa' },

  // Pinellas
  'st-petersburg-fl': { slug: 'st-petersburg-fl', name: 'St. Petersburg', county: 'Pinellas County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (St. Petersburg Team)' },
  'clearwater-fl': { slug: 'clearwater-fl', name: 'Clearwater', county: 'Pinellas County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to St. Petersburg Base' },
  'palm-harbor-fl': { slug: 'palm-harbor-fl', name: 'Palm Harbor', county: 'Pinellas County', hasOfficeOrTeam: false, nearestBaseDistance: '24 miles to St. Petersburg Base' },
  'largo-fl': { slug: 'largo-fl', name: 'Largo', county: 'Pinellas County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to St. Petersburg Base' },
  'dunedin-fl': { slug: 'dunedin-fl', name: 'Dunedin', county: 'Pinellas County', hasOfficeOrTeam: false, nearestBaseDistance: '21 miles to St. Petersburg Base' },
  'pinellas-park-fl': { slug: 'pinellas-park-fl', name: 'Pinellas Park', county: 'Pinellas County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to St. Petersburg Base' },
  'safety-harbor-fl': { slug: 'safety-harbor-fl', name: 'Safety Harbor', county: 'Pinellas County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to St. Petersburg Base' },
  'st-pete-beach-fl': { slug: 'st-pete-beach-fl', name: 'St. Pete Beach', county: 'Pinellas County', hasOfficeOrTeam: false, nearestBaseDistance: '8 miles to St. Petersburg Base' }
};

// 8. Flat Service-First Combo Pages (Section 9A: lookup table)
export interface ComboConfig {
  slug: string; // e.g. 'house-cleaning-bradenton-fl'
  service: ServiceSlug;
  citySlug: string; // e.g. 'bradenton-fl'
  cityName: string;
}

export const COMBO_PAGES: Record<string, ComboConfig> = {
  // Bradenton x 10 CORE_SERVICES (Home Market Combos)
  'house-cleaning-bradenton-fl': { slug: 'house-cleaning-bradenton-fl', service: 'house-cleaning', citySlug: 'bradenton-fl', cityName: 'Bradenton' },
  'deep-cleaning-bradenton-fl': { slug: 'deep-cleaning-bradenton-fl', service: 'deep-cleaning', citySlug: 'bradenton-fl', cityName: 'Bradenton' },
  'recurring-maid-service-bradenton-fl': { slug: 'recurring-maid-service-bradenton-fl', service: 'recurring-maid-service', citySlug: 'bradenton-fl', cityName: 'Bradenton' },
  'move-in-out-cleaning-bradenton-fl': { slug: 'move-in-out-cleaning-bradenton-fl', service: 'move-in-out-cleaning', citySlug: 'bradenton-fl', cityName: 'Bradenton' },
  'airbnb-cleaning-bradenton-fl': { slug: 'airbnb-cleaning-bradenton-fl', service: 'airbnb-cleaning', citySlug: 'bradenton-fl', cityName: 'Bradenton' },
  'post-construction-cleaning-bradenton-fl': { slug: 'post-construction-cleaning-bradenton-fl', service: 'post-construction-cleaning', citySlug: 'bradenton-fl', cityName: 'Bradenton' },
  'commercial-cleaning-bradenton-fl': { slug: 'commercial-cleaning-bradenton-fl', service: 'commercial-cleaning', citySlug: 'bradenton-fl', cityName: 'Bradenton' },
  'carpet-cleaning-bradenton-fl': { slug: 'carpet-cleaning-bradenton-fl', service: 'carpet-cleaning', citySlug: 'bradenton-fl', cityName: 'Bradenton' },
  'window-cleaning-bradenton-fl': { slug: 'window-cleaning-bradenton-fl', service: 'window-cleaning', citySlug: 'bradenton-fl', cityName: 'Bradenton' },
  'janitorial-cleaning-services-bradenton-fl': { slug: 'janitorial-cleaning-services-bradenton-fl', service: 'janitorial-cleaning-services', citySlug: 'bradenton-fl', cityName: 'Bradenton' },

  // Sarasota
  'house-cleaning-sarasota-fl': { slug: 'house-cleaning-sarasota-fl', service: 'house-cleaning', citySlug: 'sarasota-fl', cityName: 'Sarasota' },
  'deep-cleaning-sarasota-fl': { slug: 'deep-cleaning-sarasota-fl', service: 'deep-cleaning', citySlug: 'sarasota-fl', cityName: 'Sarasota' },
  'airbnb-cleaning-sarasota-fl': { slug: 'airbnb-cleaning-sarasota-fl', service: 'airbnb-cleaning', citySlug: 'sarasota-fl', cityName: 'Sarasota' },

  // Lakewood Ranch
  'house-cleaning-lakewood-ranch-fl': { slug: 'house-cleaning-lakewood-ranch-fl', service: 'house-cleaning', citySlug: 'lakewood-ranch-fl', cityName: 'Lakewood Ranch' },
  'deep-cleaning-lakewood-ranch-fl': { slug: 'deep-cleaning-lakewood-ranch-fl', service: 'deep-cleaning', citySlug: 'lakewood-ranch-fl', cityName: 'Lakewood Ranch' },

  // Venice
  'house-cleaning-venice-fl': { slug: 'house-cleaning-venice-fl', service: 'house-cleaning', citySlug: 'venice-fl', cityName: 'Venice' },
  'move-in-out-cleaning-venice-fl': { slug: 'move-in-out-cleaning-venice-fl', service: 'move-in-out-cleaning', citySlug: 'venice-fl', cityName: 'Venice' },
  'airbnb-cleaning-venice-fl': { slug: 'airbnb-cleaning-venice-fl', service: 'airbnb-cleaning', citySlug: 'venice-fl', cityName: 'Venice' },

  // Miami-Dade
  'house-cleaning-miami-fl': { slug: 'house-cleaning-miami-fl', service: 'house-cleaning', citySlug: 'miami-fl', cityName: 'Miami' },
  'deep-cleaning-miami-fl': { slug: 'deep-cleaning-miami-fl', service: 'deep-cleaning', citySlug: 'miami-fl', cityName: 'Miami' },
  'commercial-cleaning-miami-fl': { slug: 'commercial-cleaning-miami-fl', service: 'commercial-cleaning', citySlug: 'miami-fl', cityName: 'Miami' },
  'house-cleaning-homestead-fl': { slug: 'house-cleaning-homestead-fl', service: 'house-cleaning', citySlug: 'homestead-fl', cityName: 'Homestead' },
  'window-cleaning-coral-gables-fl': { slug: 'window-cleaning-coral-gables-fl', service: 'window-cleaning', citySlug: 'coral-gables-fl', cityName: 'Coral Gables' },
  'house-cleaning-coral-gables-fl': { slug: 'house-cleaning-coral-gables-fl', service: 'house-cleaning', citySlug: 'coral-gables-fl', cityName: 'Coral Gables' },
  'house-cleaning-south-miami-fl': { slug: 'house-cleaning-south-miami-fl', service: 'house-cleaning', citySlug: 'south-miami-fl', cityName: 'South Miami' },

  // Monroe / Keys
  'house-cleaning-key-largo-fl': { slug: 'house-cleaning-key-largo-fl', service: 'house-cleaning', citySlug: 'key-largo-fl', cityName: 'Key Largo' },
  'airbnb-cleaning-key-largo-fl': { slug: 'airbnb-cleaning-key-largo-fl', service: 'airbnb-cleaning', citySlug: 'key-largo-fl', cityName: 'Key Largo' },
  'house-cleaning-marathon-fl': { slug: 'house-cleaning-marathon-fl', service: 'house-cleaning', citySlug: 'marathon-fl', cityName: 'Marathon' },
  'airbnb-cleaning-marathon-fl': { slug: 'airbnb-cleaning-marathon-fl', service: 'airbnb-cleaning', citySlug: 'marathon-fl', cityName: 'Marathon' },
  'house-cleaning-islamorada-fl': { slug: 'house-cleaning-islamorada-fl', service: 'house-cleaning', citySlug: 'islamorada-fl', cityName: 'Islamorada' },

  // Hillsborough
  'house-cleaning-tampa-fl': { slug: 'house-cleaning-tampa-fl', service: 'house-cleaning', citySlug: 'tampa-fl', cityName: 'Tampa' },
  'house-cleaning-fish-hawk-fl': { slug: 'house-cleaning-fish-hawk-fl', service: 'house-cleaning', citySlug: 'fish-hawk-fl', cityName: 'Fish Hawk' },

  // Pinellas
  'house-cleaning-st-petersburg-fl': { slug: 'house-cleaning-st-petersburg-fl', service: 'house-cleaning', citySlug: 'st-petersburg-fl', cityName: 'St. Petersburg' },
  'house-cleaning-clearwater-fl': { slug: 'house-cleaning-clearwater-fl', service: 'house-cleaning', citySlug: 'clearwater-fl', cityName: 'Clearwater' },
  'house-cleaning-palm-harbor-fl': { slug: 'house-cleaning-palm-harbor-fl', service: 'house-cleaning', citySlug: 'palm-harbor-fl', cityName: 'Palm Harbor' }
};

const SERVICES_BY_LEN = [...SERVICES].sort((a, b) => b.length - a.length);

export function resolveFlatCombo(slug: string): ComboConfig | null {
  if (COMBO_PAGES[slug]) {
    return COMBO_PAGES[slug];
  }

  // Handle Longboat Key bespoke service pages: /{service}-longboat-key-fl
  if (slug.endsWith('-longboat-key-fl')) {
    const serviceSlug = slug.slice(0, -'-longboat-key-fl'.length);
    return {
      slug,
      service: serviceSlug as ServiceSlug,
      citySlug: 'longboat-key-fl',
      cityName: 'Longboat Key'
    };
  }

  // Match any approved service prefix
  for (const s of SERVICES_BY_LEN) {
    if (slug.startsWith(`${s}-`)) {
      const citySlug = slug.slice(s.length + 1);
      const city = CITY_PAGES[citySlug] || (citySlug === 'bradenton-fl' ? { name: 'Bradenton', county: 'Manatee County' } : null);
      if (city) {
        return {
          slug,
          service: s,
          citySlug,
          cityName: city.name.replace(/\s*\(.*?\)/g, '').trim()
        };
      }
    }
  }

  return null;
}

export function getRegionForCity(citySlug: string): RegionConfig | null {
  const city = CITY_PAGES[citySlug];
  if (!city) {
    const region = Object.values(REGIONS).find(r => r.slug === citySlug);
    return region || null;
  }
  const countyClean = city.county.toLowerCase();
  for (const region of Object.values(REGIONS)) {
    const regCounty = region.county.toLowerCase().replace(' county', '');
    if (countyClean.includes(regCounty)) {
      return region;
    }
  }
  return null;
}

export function getSiblingCities(citySlug: string, limit: number = 6): CityConfig[] {
  const targetCity = CITY_PAGES[citySlug];
  if (!targetCity) {
    const region = Object.values(REGIONS).find(r => r.slug === citySlug);
    if (region) {
      const regCounty = region.county.toLowerCase().replace(' county', '');
      return Object.values(CITY_PAGES)
        .filter(c => c.county.toLowerCase().includes(regCounty))
        .slice(0, limit);
    }
    return Object.values(CITY_PAGES).slice(0, limit);
  }

  const countyClean = targetCity.county.toLowerCase();
  const siblings = Object.values(CITY_PAGES).filter(c => {
    if (c.slug === citySlug) return false;
    const cCounty = c.county.toLowerCase();
    return countyClean.split('/').some(part => cCounty.includes(part.trim()));
  });

  return siblings.slice(0, limit);
}

