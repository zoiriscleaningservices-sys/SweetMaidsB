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

// 5b. Approved 6 Regional Guide Blog Posts
export interface BlogPostConfig {
  slug: string;
  path: string;
  title: string;
  priority: string;
  changefreq: string;
  indexed: boolean;
}

export const BLOG_POSTS: BlogPostConfig[] = [
  { slug: 'tampa-bay-cleaning-guide', path: '/blog/tampa-bay-cleaning-guide/', title: 'The Ultimate Tampa Bay & St. Pete Cleaning Guide: Coastal Humidity, Gulf Sand & AC Spores', priority: '0.7', changefreq: 'monthly', indexed: true },
  { slug: 'south-florida-cleaning-guide', path: '/blog/south-florida-cleaning-guide/', title: 'South Florida Luxury Living: Deep Cleaning High-Rises & Defending Against Subtropical Mold in Miami & Fort Lauderdale', priority: '0.7', changefreq: 'monthly', indexed: true },
  { slug: 'central-florida-cleaning-guide', path: '/blog/central-florida-cleaning-guide/', title: 'Central Florida Vacation Rental & Airbnb Turnover Masterclass: Cleanliness Standards in Orlando & Kissimmee', priority: '0.7', changefreq: 'monthly', indexed: true },
  { slug: 'southwest-florida-cleaning-guide', path: '/blog/southwest-florida-cleaning-guide/', title: 'Sarasota, Bradenton & Lakewood Ranch Home Care: Lanai Maintenance, Salt Mist & Seasonal Resident Openings', priority: '0.7', changefreq: 'monthly', indexed: true },
  { slug: 'first-coast-cleaning-guide', path: '/blog/first-coast-cleaning-guide/', title: 'First Coast Seasonal Cleaning Guide: Battling Pine Pollen, Atlantic Sea Mist & Red Clay in Jacksonville & St. Augustine', priority: '0.7', changefreq: 'monthly', indexed: true },
  { slug: 'florida-keys-cleaning-guide', path: '/blog/florida-keys-cleaning-guide/', title: 'Living in Paradise: Florida Keys Island Home Maintenance & Salt Air Defense Playbook', priority: '0.7', changefreq: 'monthly', indexed: true }
];

// 6. 17 Regions
export interface RegionConfig {
  slug: string; // e.g. 'bradenton-fl' or 'sarasota-fl' or 'monroe-county'
  county: string;
  name: string;
  ready: boolean;
  phone: string;
  placesServed: string[];
}

export const REGIONS: Record<string, RegionConfig> = {
  manatee: {
    slug: 'bradenton-fl', // targets /bradenton-fl/ hub
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
    slug: 'key-largo-fl',
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
    ready: true,
    phone: '(305) 851-6959',
    placesServed: [
      'Fort Lauderdale', 'Hollywood', 'Pompano Beach', 'Coral Springs', 'Pembroke Pines',
      'Miramar', 'Davie', 'Sunrise', 'Plantation', 'Deerfield Beach', 'Lauderhill',
      'Weston', 'Coconut Creek', 'Tamarac', 'Margate', 'Oakland Park', 'North Lauderdale',
      'Hallandale Beach', 'Lauderdale Lakes', 'Dania Beach', 'Cooper City', 'Parkland',
      'Wilton Manors', 'Lighthouse Point', 'Southwest Ranches', 'Lauderdale-by-the-Sea',
      'Pembroke Park', 'West Park', 'Hillsboro Beach', 'Sea Ranch Lakes', 'Lazy Lake'
    ]
  },
  palm_beach: {
    slug: 'west-palm-beach-fl',
    county: 'Palm Beach County',
    name: 'Palm Beach County',
    ready: true,
    phone: '(305) 851-6959',
    placesServed: [
      'West Palm Beach', 'Boca Raton', 'Boynton Beach', 'Delray Beach', 'Wellington',
      'Jupiter', 'Palm Beach Gardens', 'Greenacres', 'Lake Worth Beach', 'Royal Palm Beach',
      'Riviera Beach', 'Palm Beach', 'North Palm Beach', 'Lantana', 'Palm Springs',
      'Belle Glade', 'South Palm Beach', 'Tequesta', 'Highland Beach', 'Juno Beach',
      'Hypoluxo', 'Atlantis', 'Ocean Ridge', 'Lake Park', 'Haverhill', 'Pahokee',
      'South Bay', 'Loxahatchee Groves', 'Mangonia Park', 'Gulf Stream', 'Manalapan',
      'Jupiter Inlet Colony', 'Briny Breezes', 'Cloud Lake', 'Glen Ridge', 'Golf'
    ]
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
    name: 'Orange County (Greater Orlando)',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: [
      'Orlando', 'Winter Park', 'Winter Garden', 'Ocoee', 'Apopka', 'Windermere',
      'Maitland', 'Lake Buena Vista', 'Belle Isle', 'Edgewood', 'Eatonville', 'Oakland',
      'Dr. Phillips', 'Hunters Creek', 'Horizon West', 'Lake Nona', 'Avalon Park', 'Bay Lake'
    ]
  },
  seminole: {
    slug: 'sanford-fl',
    county: 'Seminole County',
    name: 'Seminole County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['Sanford', 'Altamonte Springs', 'Oviedo', 'Winter Springs', 'Casselberry', 'Longwood', 'Lake Mary']
  },
  osceola: {
    slug: 'kissimmee-fl',
    county: 'Osceola County',
    name: 'Osceola County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['Kissimmee', 'St. Cloud', 'Celebration', 'Poinciana']
  },
  lake: {
    slug: 'clermont-fl',
    county: 'Lake County',
    name: 'Lake County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['Clermont', 'Leesburg', 'Eustis', 'Mount Dora', 'Tavares', 'Minneola', 'Groveland', 'Lady Lake', 'Mascotte', 'Fruitland Park']
  },
  polk: {
    slug: 'lakeland-fl',
    county: 'Polk County',
    name: 'Polk County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['Lakeland', 'Winter Haven', 'Haines City', 'Davenport', 'Bartow', 'Lake Wales', 'Auburndale', 'Lake Alfred', 'Polk City', 'Mulberry']
  },
  volusia: {
    slug: 'daytona-beach-fl',
    county: 'Volusia County',
    name: 'Volusia County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['Daytona Beach', 'Deltona', 'DeLand', 'Port Orange', 'Ormond Beach', 'New Smyrna Beach', 'Orange City', 'DeBary', 'Edgewater', 'Holly Hill', 'Ponce Inlet']
  },
  brevard: {
    slug: 'melbourne-fl',
    county: 'Brevard County',
    name: 'Brevard County (Space Coast)',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['Melbourne', 'Palm Bay', 'Titusville', 'Cocoa', 'Cocoa Beach', 'Rockledge', 'Cape Canaveral', 'Satellite Beach', 'Merritt Island', 'West Melbourne', 'Indialantic', 'Indian Harbour Beach', 'Melbourne Beach']
  },
  duval: {
    slug: 'jacksonville-fl',
    county: 'Duval County',
    name: 'Duval County (Jacksonville Base)',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['Jacksonville', 'Jacksonville Beach', 'Atlantic Beach', 'Neptune Beach', 'Baldwin']
  },
  st_johns: {
    slug: 'st-augustine-fl',
    county: 'St. Johns County',
    name: 'St. Johns County (St. Augustine)',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['St. Augustine', 'St. Augustine Beach', 'Ponte Vedra Beach', 'Ponte Vedra', 'Nocatee', 'St. Johns', 'Fruit Cove', 'Hastings', 'Marineland']
  },
  clay: {
    slug: 'orange-park-fl',
    county: 'Clay County',
    name: 'Clay County',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['Orange Park', 'Fleming Island', 'Green Cove Springs', 'Middleburg', 'Oakleaf Plantation', 'Keystone Heights', 'Penney Farms']
  },
  nassau: {
    slug: 'fernandina-beach-fl',
    county: 'Nassau County',
    name: 'Nassau County (Amelia Island)',
    ready: true,
    phone: '(941) 222-2080',
    placesServed: ['Fernandina Beach', 'Yulee', 'Amelia Island', 'Callahan', 'Hilliard']
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
  // Manatee
  'bradenton-fl': { slug: 'bradenton-fl', name: 'Bradenton', county: 'Manatee County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Bradenton Base)' },
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
  'st-pete-beach-fl': { slug: 'st-pete-beach-fl', name: 'St. Pete Beach', county: 'Pinellas County', hasOfficeOrTeam: false, nearestBaseDistance: '8 miles to St. Petersburg Base' },

  // Broward County (All 31 Municipalities)
  'fort-lauderdale-fl': { slug: 'fort-lauderdale-fl', name: 'Fort Lauderdale', county: 'Broward County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Fort Lauderdale Team)' },
  'hollywood-fl': { slug: 'hollywood-fl', name: 'Hollywood', county: 'Broward County', hasOfficeOrTeam: true, nearestBaseDistance: '8 miles to Fort Lauderdale Base' },
  'pompano-beach-fl': { slug: 'pompano-beach-fl', name: 'Pompano Beach', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '9 miles to Fort Lauderdale Base' },
  'coral-springs-fl': { slug: 'coral-springs-fl', name: 'Coral Springs', county: 'Broward County', hasOfficeOrTeam: true, nearestBaseDistance: '15 miles to Fort Lauderdale Base' },
  'pembroke-pines-fl': { slug: 'pembroke-pines-fl', name: 'Pembroke Pines', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Fort Lauderdale Base' },
  'miramar-fl': { slug: 'miramar-fl', name: 'Miramar', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to Fort Lauderdale Base' },
  'davie-fl': { slug: 'davie-fl', name: 'Davie', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '8 miles to Fort Lauderdale Base' },
  'sunrise-fl': { slug: 'sunrise-fl', name: 'Sunrise', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '11 miles to Fort Lauderdale Base' },
  'plantation-fl': { slug: 'plantation-fl', name: 'Plantation', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Fort Lauderdale Base' },
  'deerfield-beach-fl': { slug: 'deerfield-beach-fl', name: 'Deerfield Beach', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to Fort Lauderdale Base' },
  'lauderhill-fl': { slug: 'lauderhill-fl', name: 'Lauderhill', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '5 miles to Fort Lauderdale Base' },
  'weston-fl': { slug: 'weston-fl', name: 'Weston', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to Fort Lauderdale Base' },
  'coconut-creek-fl': { slug: 'coconut-creek-fl', name: 'Coconut Creek', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Fort Lauderdale Base' },
  'tamarac-fl': { slug: 'tamarac-fl', name: 'Tamarac', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '11 miles to Fort Lauderdale Base' },
  'margate-fl': { slug: 'margate-fl', name: 'Margate', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '13 miles to Fort Lauderdale Base' },
  'oakland-park-fl': { slug: 'oakland-park-fl', name: 'Oakland Park', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '3 miles to Fort Lauderdale Base' },
  'north-lauderdale-fl': { slug: 'north-lauderdale-fl', name: 'North Lauderdale', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '10 miles to Fort Lauderdale Base' },
  'hallandale-beach-fl': { slug: 'hallandale-beach-fl', name: 'Hallandale Beach', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '12 miles to Fort Lauderdale Base' },
  'lauderdale-lakes-fl': { slug: 'lauderdale-lakes-fl', name: 'Lauderdale Lakes', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Fort Lauderdale Base' },
  'dania-beach-fl': { slug: 'dania-beach-fl', name: 'Dania Beach', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '5 miles to Fort Lauderdale Base' },
  'cooper-city-fl': { slug: 'cooper-city-fl', name: 'Cooper City', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '11 miles to Fort Lauderdale Base' },
  'parkland-fl': { slug: 'parkland-fl', name: 'Parkland', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '19 miles to Fort Lauderdale Base' },
  'wilton-manors-fl': { slug: 'wilton-manors-fl', name: 'Wilton Manors', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '2 miles to Fort Lauderdale Base' },
  'lighthouse-point-fl': { slug: 'lighthouse-point-fl', name: 'Lighthouse Point', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '12 miles to Fort Lauderdale Base' },
  'southwest-ranches-fl': { slug: 'southwest-ranches-fl', name: 'Southwest Ranches', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to Fort Lauderdale Base' },
  'lauderdale-by-the-sea-fl': { slug: 'lauderdale-by-the-sea-fl', name: 'Lauderdale-by-the-Sea', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Fort Lauderdale Base' },
  'pembroke-park-fl': { slug: 'pembroke-park-fl', name: 'Pembroke Park', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '13 miles to Fort Lauderdale Base' },
  'west-park-fl': { slug: 'west-park-fl', name: 'West Park', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '12 miles to Fort Lauderdale Base' },
  'hillsboro-beach-fl': { slug: 'hillsboro-beach-fl', name: 'Hillsboro Beach', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Fort Lauderdale Base' },
  'sea-ranch-lakes-fl': { slug: 'sea-ranch-lakes-fl', name: 'Sea Ranch Lakes', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '7 miles to Fort Lauderdale Base' },
  'lazy-lake-fl': { slug: 'lazy-lake-fl', name: 'Lazy Lake', county: 'Broward County', hasOfficeOrTeam: false, nearestBaseDistance: '3 miles to Fort Lauderdale Base' },

  // Palm Beach County (All 36 Municipalities)
  'west-palm-beach-fl': { slug: 'west-palm-beach-fl', name: 'West Palm Beach', county: 'Palm Beach County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (West Palm Beach Team)' },
  'boca-raton-fl': { slug: 'boca-raton-fl', name: 'Boca Raton', county: 'Palm Beach County', hasOfficeOrTeam: true, nearestBaseDistance: '24 miles to West Palm Beach Base' },
  'boynton-beach-fl': { slug: 'boynton-beach-fl', name: 'Boynton Beach', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '12 miles to West Palm Beach Base' },
  'delray-beach-fl': { slug: 'delray-beach-fl', name: 'Delray Beach', county: 'Palm Beach County', hasOfficeOrTeam: true, nearestBaseDistance: '18 miles to West Palm Beach Base' },
  'wellington-fl': { slug: 'wellington-fl', name: 'Wellington', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to West Palm Beach Base' },
  'jupiter-fl': { slug: 'jupiter-fl', name: 'Jupiter', county: 'Palm Beach County', hasOfficeOrTeam: true, nearestBaseDistance: '16 miles to West Palm Beach Base' },
  'palm-beach-gardens-fl': { slug: 'palm-beach-gardens-fl', name: 'Palm Beach Gardens', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '10 miles to West Palm Beach Base' },
  'greenacres-fl': { slug: 'greenacres-fl', name: 'Greenacres', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '7 miles to West Palm Beach Base' },
  'lake-worth-beach-fl': { slug: 'lake-worth-beach-fl', name: 'Lake Worth Beach', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to West Palm Beach Base' },
  'royal-palm-beach-fl': { slug: 'royal-palm-beach-fl', name: 'Royal Palm Beach', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '10 miles to West Palm Beach Base' },
  'riviera-beach-fl': { slug: 'riviera-beach-fl', name: 'Riviera Beach', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '5 miles to West Palm Beach Base' },
  'palm-beach-fl': { slug: 'palm-beach-fl', name: 'Palm Beach', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '2 miles to West Palm Beach Base' },
  'north-palm-beach-fl': { slug: 'north-palm-beach-fl', name: 'North Palm Beach', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '8 miles to West Palm Beach Base' },
  'lantana-fl': { slug: 'lantana-fl', name: 'Lantana', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '9 miles to West Palm Beach Base' },
  'palm-springs-fl': { slug: 'palm-springs-fl', name: 'Palm Springs', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to West Palm Beach Base' },
  'belle-glade-fl': { slug: 'belle-glade-fl', name: 'Belle Glade', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '42 miles to West Palm Beach Base' },
  'south-palm-beach-fl': { slug: 'south-palm-beach-fl', name: 'South Palm Beach', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '10 miles to West Palm Beach Base' },
  'tequesta-fl': { slug: 'tequesta-fl', name: 'Tequesta', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '19 miles to West Palm Beach Base' },
  'highland-beach-fl': { slug: 'highland-beach-fl', name: 'Highland Beach', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '22 miles to West Palm Beach Base' },
  'juno-beach-fl': { slug: 'juno-beach-fl', name: 'Juno Beach', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '13 miles to West Palm Beach Base' },
  'hypoluxo-fl': { slug: 'hypoluxo-fl', name: 'Hypoluxo', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '11 miles to West Palm Beach Base' },
  'atlantis-fl': { slug: 'atlantis-fl', name: 'Atlantis', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '9 miles to West Palm Beach Base' },
  'ocean-ridge-fl': { slug: 'ocean-ridge-fl', name: 'Ocean Ridge', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to West Palm Beach Base' },
  'lake-park-fl': { slug: 'lake-park-fl', name: 'Lake Park', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '7 miles to West Palm Beach Base' },
  'haverhill-fl': { slug: 'haverhill-fl', name: 'Haverhill', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '4 miles to West Palm Beach Base' },
  'pahokee-fl': { slug: 'pahokee-fl', name: 'Pahokee', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '40 miles to West Palm Beach Base' },
  'south-bay-fl': { slug: 'south-bay-fl', name: 'South Bay', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '43 miles to West Palm Beach Base' },
  'loxahatchee-groves-fl': { slug: 'loxahatchee-groves-fl', name: 'Loxahatchee Groves', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to West Palm Beach Base' },
  'mangonia-park-fl': { slug: 'mangonia-park-fl', name: 'Mangonia Park', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '3 miles to West Palm Beach Base' },
  'gulf-stream-fl': { slug: 'gulf-stream-fl', name: 'Gulf Stream', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to West Palm Beach Base' },
  'manalapan-fl': { slug: 'manalapan-fl', name: 'Manalapan', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '11 miles to West Palm Beach Base' },
  'jupiter-inlet-colony-fl': { slug: 'jupiter-inlet-colony-fl', name: 'Jupiter Inlet Colony', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to West Palm Beach Base' },
  'briny-breezes-fl': { slug: 'briny-breezes-fl', name: 'Briny Breezes', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to West Palm Beach Base' },
  'cloud-lake-fl': { slug: 'cloud-lake-fl', name: 'Cloud Lake', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '3 miles to West Palm Beach Base' },
  'glen-ridge-fl': { slug: 'glen-ridge-fl', name: 'Glen Ridge', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '3 miles to West Palm Beach Base' },
  'golf-fl': { slug: 'golf-fl', name: 'Golf', county: 'Palm Beach County', hasOfficeOrTeam: false, nearestBaseDistance: '17 miles to West Palm Beach Base' },

  // Orange County (Greater Orlando Core & Suburbs)
  'orlando-fl': { slug: 'orlando-fl', name: 'Orlando', county: 'Orange County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Orlando Team)' },
  'winter-park-fl': { slug: 'winter-park-fl', name: 'Winter Park', county: 'Orange County', hasOfficeOrTeam: true, nearestBaseDistance: '5 miles to Orlando Base' },
  'winter-garden-fl': { slug: 'winter-garden-fl', name: 'Winter Garden', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Orlando Base' },
  'ocoee-fl': { slug: 'ocoee-fl', name: 'Ocoee', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '11 miles to Orlando Base' },
  'apopka-fl': { slug: 'apopka-fl', name: 'Apopka', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to Orlando Base' },
  'windermere-fl': { slug: 'windermere-fl', name: 'Windermere', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '12 miles to Orlando Base' },
  'maitland-fl': { slug: 'maitland-fl', name: 'Maitland', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '8 miles to Orlando Base' },
  'lake-buena-vista-fl': { slug: 'lake-buena-vista-fl', name: 'Lake Buena Vista', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to Orlando Base' },
  'belle-isle-fl': { slug: 'belle-isle-fl', name: 'Belle Isle', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Orlando Base' },
  'edgewood-fl': { slug: 'edgewood-fl', name: 'Edgewood', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '4 miles to Orlando Base' },
  'eatonville-fl': { slug: 'eatonville-fl', name: 'Eatonville', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '6 miles to Orlando Base' },
  'oakland-fl': { slug: 'oakland-fl', name: 'Oakland', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to Orlando Base' },
  'dr-phillips-fl': { slug: 'dr-phillips-fl', name: 'Dr. Phillips', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '10 miles to Orlando Base' },
  'hunters-creek-fl': { slug: 'hunters-creek-fl', name: 'Hunters Creek', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '13 miles to Orlando Base' },
  'horizon-west-fl': { slug: 'horizon-west-fl', name: 'Horizon West', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '17 miles to Orlando Base' },
  'lake-nona-fl': { slug: 'lake-nona-fl', name: 'Lake Nona', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to Orlando Base' },
  'avalon-park-fl': { slug: 'avalon-park-fl', name: 'Avalon Park', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Orlando Base' },
  'bay-lake-fl': { slug: 'bay-lake-fl', name: 'Bay Lake', county: 'Orange County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to Orlando Base' },

  // Seminole County
  'sanford-fl': { slug: 'sanford-fl', name: 'Sanford', county: 'Seminole County', hasOfficeOrTeam: true, nearestBaseDistance: '22 miles to Orlando Base' },
  'altamonte-springs-fl': { slug: 'altamonte-springs-fl', name: 'Altamonte Springs', county: 'Seminole County', hasOfficeOrTeam: false, nearestBaseDistance: '9 miles to Orlando Base' },
  'oviedo-fl': { slug: 'oviedo-fl', name: 'Oviedo', county: 'Seminole County', hasOfficeOrTeam: false, nearestBaseDistance: '14 miles to Orlando Base' },
  'winter-springs-fl': { slug: 'winter-springs-fl', name: 'Winter Springs', county: 'Seminole County', hasOfficeOrTeam: false, nearestBaseDistance: '13 miles to Orlando Base' },
  'casselberry-fl': { slug: 'casselberry-fl', name: 'Casselberry', county: 'Seminole County', hasOfficeOrTeam: false, nearestBaseDistance: '11 miles to Orlando Base' },
  'longwood-fl': { slug: 'longwood-fl', name: 'Longwood', county: 'Seminole County', hasOfficeOrTeam: false, nearestBaseDistance: '13 miles to Orlando Base' },
  'lake-mary-fl': { slug: 'lake-mary-fl', name: 'Lake Mary', county: 'Seminole County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to Orlando Base' },

  // Osceola County
  'kissimmee-fl': { slug: 'kissimmee-fl', name: 'Kissimmee', county: 'Osceola County', hasOfficeOrTeam: true, nearestBaseDistance: '18 miles to Orlando Base' },
  'st-cloud-fl': { slug: 'st-cloud-fl', name: 'St. Cloud', county: 'Osceola County', hasOfficeOrTeam: false, nearestBaseDistance: '25 miles to Orlando Base' },
  'celebration-fl': { slug: 'celebration-fl', name: 'Celebration', county: 'Osceola County', hasOfficeOrTeam: false, nearestBaseDistance: '20 miles to Orlando Base' },
  'poinciana-fl': { slug: 'poinciana-fl', name: 'Poinciana', county: 'Osceola County', hasOfficeOrTeam: false, nearestBaseDistance: '32 miles to Orlando Base' },

  // Lake County
  'clermont-fl': { slug: 'clermont-fl', name: 'Clermont', county: 'Lake County', hasOfficeOrTeam: true, nearestBaseDistance: '22 miles to Orlando Base' },
  'leesburg-fl': { slug: 'leesburg-fl', name: 'Leesburg', county: 'Lake County', hasOfficeOrTeam: false, nearestBaseDistance: '42 miles to Orlando Base' },
  'eustis-fl': { slug: 'eustis-fl', name: 'Eustis', county: 'Lake County', hasOfficeOrTeam: false, nearestBaseDistance: '35 miles to Orlando Base' },
  'mount-dora-fl': { slug: 'mount-dora-fl', name: 'Mount Dora', county: 'Lake County', hasOfficeOrTeam: false, nearestBaseDistance: '30 miles to Orlando Base' },
  'tavares-fl': { slug: 'tavares-fl', name: 'Tavares', county: 'Lake County', hasOfficeOrTeam: false, nearestBaseDistance: '36 miles to Orlando Base' },
  'minneola-fl': { slug: 'minneola-fl', name: 'Minneola', county: 'Lake County', hasOfficeOrTeam: false, nearestBaseDistance: '24 miles to Orlando Base' },
  'groveland-fl': { slug: 'groveland-fl', name: 'Groveland', county: 'Lake County', hasOfficeOrTeam: false, nearestBaseDistance: '28 miles to Orlando Base' },
  'lady-lake-fl': { slug: 'lady-lake-fl', name: 'Lady Lake', county: 'Lake County', hasOfficeOrTeam: false, nearestBaseDistance: '50 miles to Orlando Base' },
  'mascotte-fl': { slug: 'mascotte-fl', name: 'Mascotte', county: 'Lake County', hasOfficeOrTeam: false, nearestBaseDistance: '31 miles to Orlando Base' },
  'fruitland-park-fl': { slug: 'fruitland-park-fl', name: 'Fruitland Park', county: 'Lake County', hasOfficeOrTeam: false, nearestBaseDistance: '46 miles to Orlando Base' },

  // Polk County
  'lakeland-fl': { slug: 'lakeland-fl', name: 'Lakeland', county: 'Polk County', hasOfficeOrTeam: true, nearestBaseDistance: '54 miles to Orlando Base' },
  'winter-haven-fl': { slug: 'winter-haven-fl', name: 'Winter Haven', county: 'Polk County', hasOfficeOrTeam: false, nearestBaseDistance: '48 miles to Orlando Base' },
  'haines-city-fl': { slug: 'haines-city-fl', name: 'Haines City', county: 'Polk County', hasOfficeOrTeam: false, nearestBaseDistance: '38 miles to Orlando Base' },
  'davenport-fl': { slug: 'davenport-fl', name: 'Davenport', county: 'Polk County', hasOfficeOrTeam: false, nearestBaseDistance: '33 miles to Orlando Base' },
  'bartow-fl': { slug: 'bartow-fl', name: 'Bartow', county: 'Polk County', hasOfficeOrTeam: false, nearestBaseDistance: '58 miles to Orlando Base' },
  'lake-wales-fl': { slug: 'lake-wales-fl', name: 'Lake Wales', county: 'Polk County', hasOfficeOrTeam: false, nearestBaseDistance: '52 miles to Orlando Base' },
  'auburndale-fl': { slug: 'auburndale-fl', name: 'Auburndale', county: 'Polk County', hasOfficeOrTeam: false, nearestBaseDistance: '48 miles to Orlando Base' },
  'lake-alfred-fl': { slug: 'lake-alfred-fl', name: 'Lake Alfred', county: 'Polk County', hasOfficeOrTeam: false, nearestBaseDistance: '44 miles to Orlando Base' },
  'polk-city-fl': { slug: 'polk-city-fl', name: 'Polk City', county: 'Polk County', hasOfficeOrTeam: false, nearestBaseDistance: '42 miles to Orlando Base' },
  'mulberry-fl': { slug: 'mulberry-fl', name: 'Mulberry', county: 'Polk County', hasOfficeOrTeam: false, nearestBaseDistance: '62 miles to Orlando Base' },

  // Volusia County
  'daytona-beach-fl': { slug: 'daytona-beach-fl', name: 'Daytona Beach', county: 'Volusia County', hasOfficeOrTeam: true, nearestBaseDistance: '55 miles to Orlando Base' },
  'deltona-fl': { slug: 'deltona-fl', name: 'Deltona', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '28 miles to Orlando Base' },
  'deland-fl': { slug: 'deland-fl', name: 'DeLand', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '38 miles to Orlando Base' },
  'port-orange-fl': { slug: 'port-orange-fl', name: 'Port Orange', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '50 miles to Orlando Base' },
  'ormond-beach-fl': { slug: 'ormond-beach-fl', name: 'Ormond Beach', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '60 miles to Orlando Base' },
  'new-smyrna-beach-fl': { slug: 'new-smyrna-beach-fl', name: 'New Smyrna Beach', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '52 miles to Orlando Base' },
  'orange-city-fl': { slug: 'orange-city-fl', name: 'Orange City', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '32 miles to Orlando Base' },
  'debary-fl': { slug: 'debary-fl', name: 'DeBary', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '26 miles to Orlando Base' },
  'edgewater-fl': { slug: 'edgewater-fl', name: 'Edgewater', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '54 miles to Orlando Base' },
  'holly-hill-fl': { slug: 'holly-hill-fl', name: 'Holly Hill', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '57 miles to Orlando Base' },
  'ponce-inlet-fl': { slug: 'ponce-inlet-fl', name: 'Ponce Inlet', county: 'Volusia County', hasOfficeOrTeam: false, nearestBaseDistance: '58 miles to Orlando Base' },

  // Brevard County (Space Coast)
  'melbourne-fl': { slug: 'melbourne-fl', name: 'Melbourne', county: 'Brevard County', hasOfficeOrTeam: true, nearestBaseDistance: '68 miles to Orlando Base' },
  'palm-bay-fl': { slug: 'palm-bay-fl', name: 'Palm Bay', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '72 miles to Orlando Base' },
  'titusville-fl': { slug: 'titusville-fl', name: 'Titusville', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '40 miles to Orlando Base' },
  'cocoa-fl': { slug: 'cocoa-fl', name: 'Cocoa', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '46 miles to Orlando Base' },
  'cocoa-beach-fl': { slug: 'cocoa-beach-fl', name: 'Cocoa Beach', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '56 miles to Orlando Base' },
  'rockledge-fl': { slug: 'rockledge-fl', name: 'Rockledge', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '50 miles to Orlando Base' },
  'cape-canaveral-fl': { slug: 'cape-canaveral-fl', name: 'Cape Canaveral', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '54 miles to Orlando Base' },
  'satellite-beach-fl': { slug: 'satellite-beach-fl', name: 'Satellite Beach', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '64 miles to Orlando Base' },
  'merritt-island-fl': { slug: 'merritt-island-fl', name: 'Merritt Island', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '50 miles to Orlando Base' },
  'west-melbourne-fl': { slug: 'west-melbourne-fl', name: 'West Melbourne', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '66 miles to Orlando Base' },
  'indialantic-fl': { slug: 'indialantic-fl', name: 'Indialantic', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '70 miles to Orlando Base' },
  'indian-harbour-beach-fl': { slug: 'indian-harbour-beach-fl', name: 'Indian Harbour Beach', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '66 miles to Orlando Base' },
  'melbourne-beach-fl': { slug: 'melbourne-beach-fl', name: 'Melbourne Beach', county: 'Brevard County', hasOfficeOrTeam: false, nearestBaseDistance: '72 miles to Orlando Base' },

  // Duval County (Jacksonville Core & Beaches)
  'jacksonville-fl': { slug: 'jacksonville-fl', name: 'Jacksonville', county: 'Duval County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (Jacksonville Team)' },
  'jacksonville-beach-fl': { slug: 'jacksonville-beach-fl', name: 'Jacksonville Beach', county: 'Duval County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to Jacksonville Base' },
  'atlantic-beach-fl': { slug: 'atlantic-beach-fl', name: 'Atlantic Beach', county: 'Duval County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to Jacksonville Base' },
  'neptune-beach-fl': { slug: 'neptune-beach-fl', name: 'Neptune Beach', county: 'Duval County', hasOfficeOrTeam: false, nearestBaseDistance: '15 miles to Jacksonville Base' },
  'baldwin-fl': { slug: 'baldwin-fl', name: 'Baldwin', county: 'Duval County', hasOfficeOrTeam: false, nearestBaseDistance: '20 miles to Jacksonville Base' },

  // St. Johns County (St. Augustine & Northern Suburbs)
  'st-augustine-fl': { slug: 'st-augustine-fl', name: 'St. Augustine', county: 'St. Johns County', hasOfficeOrTeam: true, nearestBaseDistance: '0 miles (St. Augustine Team)' },
  'st-augustine-beach-fl': { slug: 'st-augustine-beach-fl', name: 'St. Augustine Beach', county: 'St. Johns County', hasOfficeOrTeam: false, nearestBaseDistance: '5 miles to St. Augustine Base' },
  'ponte-vedra-beach-fl': { slug: 'ponte-vedra-beach-fl', name: 'Ponte Vedra Beach', county: 'St. Johns County', hasOfficeOrTeam: false, nearestBaseDistance: '25 miles to St. Augustine Base' },
  'ponte-vedra-fl': { slug: 'ponte-vedra-fl', name: 'Ponte Vedra', county: 'St. Johns County', hasOfficeOrTeam: false, nearestBaseDistance: '24 miles to St. Augustine Base' },
  'nocatee-fl': { slug: 'nocatee-fl', name: 'Nocatee', county: 'St. Johns County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to St. Augustine Base' },
  'st-johns-fl': { slug: 'st-johns-fl', name: 'St. Johns', county: 'St. Johns County', hasOfficeOrTeam: false, nearestBaseDistance: '20 miles to St. Augustine Base' },
  'fruit-cove-fl': { slug: 'fruit-cove-fl', name: 'Fruit Cove', county: 'St. Johns County', hasOfficeOrTeam: false, nearestBaseDistance: '24 miles to St. Augustine Base' },
  'hastings-fl': { slug: 'hastings-fl', name: 'Hastings', county: 'St. Johns County', hasOfficeOrTeam: false, nearestBaseDistance: '16 miles to St. Augustine Base' },
  'marineland-fl': { slug: 'marineland-fl', name: 'Marineland', county: 'St. Johns County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to St. Augustine Base' },

  // Clay County (Southwest Metro)
  'orange-park-fl': { slug: 'orange-park-fl', name: 'Orange Park', county: 'Clay County', hasOfficeOrTeam: true, nearestBaseDistance: '14 miles to Jacksonville Base' },
  'fleming-island-fl': { slug: 'fleming-island-fl', name: 'Fleming Island', county: 'Clay County', hasOfficeOrTeam: false, nearestBaseDistance: '20 miles to Jacksonville Base' },
  'green-cove-springs-fl': { slug: 'green-cove-springs-fl', name: 'Green Cove Springs', county: 'Clay County', hasOfficeOrTeam: false, nearestBaseDistance: '28 miles to Jacksonville Base' },
  'middleburg-fl': { slug: 'middleburg-fl', name: 'Middleburg', county: 'Clay County', hasOfficeOrTeam: false, nearestBaseDistance: '26 miles to Jacksonville Base' },
  'oakleaf-plantation-fl': { slug: 'oakleaf-plantation-fl', name: 'Oakleaf Plantation', county: 'Clay County', hasOfficeOrTeam: false, nearestBaseDistance: '18 miles to Jacksonville Base' },
  'keystone-heights-fl': { slug: 'keystone-heights-fl', name: 'Keystone Heights', county: 'Clay County', hasOfficeOrTeam: false, nearestBaseDistance: '48 miles to Jacksonville Base' },
  'penney-farms-fl': { slug: 'penney-farms-fl', name: 'Penney Farms', county: 'Clay County', hasOfficeOrTeam: false, nearestBaseDistance: '34 miles to Jacksonville Base' },

  // Nassau County (North Metro & Amelia Island)
  'fernandina-beach-fl': { slug: 'fernandina-beach-fl', name: 'Fernandina Beach', county: 'Nassau County', hasOfficeOrTeam: true, nearestBaseDistance: '35 miles to Jacksonville Base' },
  'yulee-fl': { slug: 'yulee-fl', name: 'Yulee', county: 'Nassau County', hasOfficeOrTeam: false, nearestBaseDistance: '24 miles to Jacksonville Base' },
  'amelia-island-fl': { slug: 'amelia-island-fl', name: 'Amelia Island', county: 'Nassau County', hasOfficeOrTeam: false, nearestBaseDistance: '32 miles to Jacksonville Base' },
  'callahan-fl': { slug: 'callahan-fl', name: 'Callahan', county: 'Nassau County', hasOfficeOrTeam: false, nearestBaseDistance: '20 miles to Jacksonville Base' },
  'hilliard-fl': { slug: 'hilliard-fl', name: 'Hilliard', county: 'Nassau County', hasOfficeOrTeam: false, nearestBaseDistance: '30 miles to Jacksonville Base' }
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
  'house-cleaning-palm-harbor-fl': { slug: 'house-cleaning-palm-harbor-fl', service: 'house-cleaning', citySlug: 'palm-harbor-fl', cityName: 'Palm Harbor' },

  // Broward County Combos
  'house-cleaning-fort-lauderdale-fl': { slug: 'house-cleaning-fort-lauderdale-fl', service: 'house-cleaning', citySlug: 'fort-lauderdale-fl', cityName: 'Fort Lauderdale' },
  'deep-cleaning-fort-lauderdale-fl': { slug: 'deep-cleaning-fort-lauderdale-fl', service: 'deep-cleaning', citySlug: 'fort-lauderdale-fl', cityName: 'Fort Lauderdale' },
  'commercial-cleaning-fort-lauderdale-fl': { slug: 'commercial-cleaning-fort-lauderdale-fl', service: 'commercial-cleaning', citySlug: 'fort-lauderdale-fl', cityName: 'Fort Lauderdale' },
  'house-cleaning-hollywood-fl': { slug: 'house-cleaning-hollywood-fl', service: 'house-cleaning', citySlug: 'hollywood-fl', cityName: 'Hollywood' },
  'deep-cleaning-hollywood-fl': { slug: 'deep-cleaning-hollywood-fl', service: 'deep-cleaning', citySlug: 'hollywood-fl', cityName: 'Hollywood' },
  'house-cleaning-pompano-beach-fl': { slug: 'house-cleaning-pompano-beach-fl', service: 'house-cleaning', citySlug: 'pompano-beach-fl', cityName: 'Pompano Beach' },
  'house-cleaning-coral-springs-fl': { slug: 'house-cleaning-coral-springs-fl', service: 'house-cleaning', citySlug: 'coral-springs-fl', cityName: 'Coral Springs' },

  // Palm Beach County Combos
  'house-cleaning-west-palm-beach-fl': { slug: 'house-cleaning-west-palm-beach-fl', service: 'house-cleaning', citySlug: 'west-palm-beach-fl', cityName: 'West Palm Beach' },
  'deep-cleaning-west-palm-beach-fl': { slug: 'deep-cleaning-west-palm-beach-fl', service: 'deep-cleaning', citySlug: 'west-palm-beach-fl', cityName: 'West Palm Beach' },
  'commercial-cleaning-west-palm-beach-fl': { slug: 'commercial-cleaning-west-palm-beach-fl', service: 'commercial-cleaning', citySlug: 'west-palm-beach-fl', cityName: 'West Palm Beach' },
  'house-cleaning-boca-raton-fl': { slug: 'house-cleaning-boca-raton-fl', service: 'house-cleaning', citySlug: 'boca-raton-fl', cityName: 'Boca Raton' },
  'deep-cleaning-boca-raton-fl': { slug: 'deep-cleaning-boca-raton-fl', service: 'deep-cleaning', citySlug: 'boca-raton-fl', cityName: 'Boca Raton' },
  'move-in-out-cleaning-boca-raton-fl': { slug: 'move-in-out-cleaning-boca-raton-fl', service: 'move-in-out-cleaning', citySlug: 'boca-raton-fl', cityName: 'Boca Raton' },
  'house-cleaning-delray-beach-fl': { slug: 'house-cleaning-delray-beach-fl', service: 'house-cleaning', citySlug: 'delray-beach-fl', cityName: 'Delray Beach' },
  'house-cleaning-boynton-beach-fl': { slug: 'house-cleaning-boynton-beach-fl', service: 'house-cleaning', citySlug: 'boynton-beach-fl', cityName: 'Boynton Beach' },
  'house-cleaning-jupiter-fl': { slug: 'house-cleaning-jupiter-fl', service: 'house-cleaning', citySlug: 'jupiter-fl', cityName: 'Jupiter' },
  'airbnb-cleaning-jupiter-fl': { slug: 'airbnb-cleaning-jupiter-fl', service: 'airbnb-cleaning', citySlug: 'jupiter-fl', cityName: 'Jupiter' },

  // Orlando & Central Florida Combos
  'house-cleaning-orlando-fl': { slug: 'house-cleaning-orlando-fl', service: 'house-cleaning', citySlug: 'orlando-fl', cityName: 'Orlando' },
  'deep-cleaning-orlando-fl': { slug: 'deep-cleaning-orlando-fl', service: 'deep-cleaning', citySlug: 'orlando-fl', cityName: 'Orlando' },
  'airbnb-cleaning-orlando-fl': { slug: 'airbnb-cleaning-orlando-fl', service: 'airbnb-cleaning', citySlug: 'orlando-fl', cityName: 'Orlando' },
  'commercial-cleaning-orlando-fl': { slug: 'commercial-cleaning-orlando-fl', service: 'commercial-cleaning', citySlug: 'orlando-fl', cityName: 'Orlando' },
  'house-cleaning-winter-park-fl': { slug: 'house-cleaning-winter-park-fl', service: 'house-cleaning', citySlug: 'winter-park-fl', cityName: 'Winter Park' },
  'house-cleaning-kissimmee-fl': { slug: 'house-cleaning-kissimmee-fl', service: 'house-cleaning', citySlug: 'kissimmee-fl', cityName: 'Kissimmee' },
  'airbnb-cleaning-kissimmee-fl': { slug: 'airbnb-cleaning-kissimmee-fl', service: 'airbnb-cleaning', citySlug: 'kissimmee-fl', cityName: 'Kissimmee' },
  'house-cleaning-clermont-fl': { slug: 'house-cleaning-clermont-fl', service: 'house-cleaning', citySlug: 'clermont-fl', cityName: 'Clermont' },
  'house-cleaning-lakeland-fl': { slug: 'house-cleaning-lakeland-fl', service: 'house-cleaning', citySlug: 'lakeland-fl', cityName: 'Lakeland' },
  'house-cleaning-daytona-beach-fl': { slug: 'house-cleaning-daytona-beach-fl', service: 'house-cleaning', citySlug: 'daytona-beach-fl', cityName: 'Daytona Beach' },
  'house-cleaning-melbourne-fl': { slug: 'house-cleaning-melbourne-fl', service: 'house-cleaning', citySlug: 'melbourne-fl', cityName: 'Melbourne' },

  // Jacksonville & St. Augustine Combos
  'house-cleaning-jacksonville-fl': { slug: 'house-cleaning-jacksonville-fl', service: 'house-cleaning', citySlug: 'jacksonville-fl', cityName: 'Jacksonville' },
  'deep-cleaning-jacksonville-fl': { slug: 'deep-cleaning-jacksonville-fl', service: 'deep-cleaning', citySlug: 'jacksonville-fl', cityName: 'Jacksonville' },
  'commercial-cleaning-jacksonville-fl': { slug: 'commercial-cleaning-jacksonville-fl', service: 'commercial-cleaning', citySlug: 'jacksonville-fl', cityName: 'Jacksonville' },
  'house-cleaning-st-augustine-fl': { slug: 'house-cleaning-st-augustine-fl', service: 'house-cleaning', citySlug: 'st-augustine-fl', cityName: 'St. Augustine' },
  'deep-cleaning-st-augustine-fl': { slug: 'deep-cleaning-st-augustine-fl', service: 'deep-cleaning', citySlug: 'st-augustine-fl', cityName: 'St. Augustine' },
  'airbnb-cleaning-st-augustine-fl': { slug: 'airbnb-cleaning-st-augustine-fl', service: 'airbnb-cleaning', citySlug: 'st-augustine-fl', cityName: 'St. Augustine' },
  'house-cleaning-ponte-vedra-beach-fl': { slug: 'house-cleaning-ponte-vedra-beach-fl', service: 'house-cleaning', citySlug: 'ponte-vedra-beach-fl', cityName: 'Ponte Vedra Beach' },
  'house-cleaning-orange-park-fl': { slug: 'house-cleaning-orange-park-fl', service: 'house-cleaning', citySlug: 'orange-park-fl', cityName: 'Orange Park' },
  'house-cleaning-fernandina-beach-fl': { slug: 'house-cleaning-fernandina-beach-fl', service: 'house-cleaning', citySlug: 'fernandina-beach-fl', cityName: 'Fernandina Beach' }
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

