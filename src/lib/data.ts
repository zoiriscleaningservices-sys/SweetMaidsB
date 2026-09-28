import fs from 'fs';
import path from 'path';

export const serviceSlugs = [
  // Primary Residential
  "house-cleaning", "deep-cleaning", "move-in-out-cleaning", "move-in-cleaning", "move-out-cleaning",
  "airbnb-cleaning", "vacation-rental-cleaning", "apartment-cleaning", "condo-cleaning",
  "luxury-estate-cleaning", "luxury-penthouse-cleaning", "spring-cleaning", "same-day-cleaning",
  "recurring-maid-service", "weekly-maid-service", "bi-weekly-maid-service", "monthly-maid-service",
  
  // Specialized & Restoration
  "post-construction-cleaning", "post-renovation-cleaning", "carpet-cleaning", "steam-cleaning",
  "pressure-washing", "exterior-soft-washing", "window-cleaning", "gutter-cleaning",
  "tile-and-grout-cleaning", "pet-hair-removal-cleaning", "oven-appliance-deep-cleaning",
  "eviction-cleanout-service", "hoarder-cleaning-service", "senior-home-cleaning",
  "solar-panel-cleaning", "home-watch-services", "property-maintenance",
  
  // Commercial & Facility Janitorial
  "commercial-cleaning", "office-janitorial-services", "janitorial-cleaning-services",
  "medical-dental-facility-cleaning", "industrial-warehouse-cleaning", "floor-stripping-waxing",
  "gym-fitness-center-cleaning", "school-daycare-cleaning", "church-worship-center-cleaning",
  "property-management-janitorial", "law-firm-office-cleaning", "bank-cleaning-services",
  "restaurant-kitchen-cleaning", "retail-store-cleaning", "salon-spa-cleaning"
];

export interface GeoEntity {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  type: 'city' | 'zip' | 'neighborhood' | 'county';
  parentCity?: string;
  parentCounty?: string;
}

export interface CityLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface NearestCity {
  slug: string;
  name: string;
  dist: number;
}

let cachedMasterDb: any = null;

export function getFloridaMasterDb(): any {
  if (!cachedMasterDb) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'js', 'florida_geo_master.json');
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        cachedMasterDb = JSON.parse(fileContents);
      }
    } catch (e) {
      console.error("Error reading florida_geo_master.json", e);
    }
  }
  return cachedMasterDb;
}

let cachedLocationData: Record<string, CityLocation> | null = null;

export function getLocationData(): Record<string, CityLocation> {
  if (!cachedLocationData) {
    const filePath = path.join(process.cwd(), 'public', 'js', 'city_coords.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    cachedLocationData = JSON.parse(fileContents);
  }
  return cachedLocationData!;
}

export function getLocationSlugs(): string[] {
  const data = getLocationData();
  return Object.keys(data);
}

/**
 * Universal Entity Resolver: Resolves Cities, Zip Codes, Neighborhoods, and Counties
 */
export function resolveAnyLocation(slug: string): GeoEntity | null {
  const cleanSlug = slug.toLowerCase().trim();
  const systemRoutes = [
    'about', 'blog', 'gallery', 'locations', 'login', 'booknow', 'book-online', 'cost',
    'privacy-policy', 'terms-and-conditions', 'privacy', 'terms', 'robots.txt', 'sitemap.xml',
    'icon.png', 'templates', '_next', 'static', 'api', 'florida-cleaning', 'florida-beach-cleaning',
    'florida', ...serviceSlugs
  ];
  if (systemRoutes.includes(cleanSlug)) {
    return null;
  }
  const db = getFloridaMasterDb();

  // Strictly resolve approved cities from Site Structure (SSOT)
  const { CITY_PAGES } = require('@/config/site-structure');
  if (CITY_PAGES && CITY_PAGES[cleanSlug]) {
    const cp = CITY_PAGES[cleanSlug];
    const cities = getLocationData();
    const altSlug = cleanSlug.replace(/^st-/, 'saint-');
    const geo = cities[cleanSlug] || cities[altSlug] || { lat: 27.725, lng: -82.741 };
    return {
      name: cp.name,
      slug: cleanSlug,
      lat: geo.lat || 27.725,
      lng: geo.lng || -82.741,
      type: 'city',
      parentCounty: cp.county
    };
  }

  // All unapproved cities, zip codes, neighborhoods, and counties return null (404/410/redirect)
  return null;
}

export function formatName(name: string): string {
  return name.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getNearestLocations(currentSlug: string, count: number = 8): NearestCity[] {
  const current = resolveAnyLocation(currentSlug);
  if (!current) return [];

  const distances: NearestCity[] = [];
  const allLocations = getAllLocations();
  for (const city of allLocations) {
    if (city.slug === currentSlug) continue;
    const dist = haversineDistance(current.lat, current.lng, city.lat, city.lng);
    distances.push({
      slug: city.slug,
      name: city.name,
      dist: Math.round(dist * 10) / 10
    });
  }

  distances.sort((a, b) => a.dist - b.dist);
  return distances.slice(0, count);
}

export interface LocationDirectoryItem {
  slug: string;
  name: string;
  lat: number;
  lng: number;
}

export function getAllLocations(): LocationDirectoryItem[] {
  const { CITY_PAGES } = require('@/config/site-structure');
  const cities = getLocationData();
  const list: LocationDirectoryItem[] = Object.entries(CITY_PAGES).map(([slug, cp]: [string, any]) => {
    const altSlug = slug.replace(/^st-/, 'saint-');
    const geo = cities[slug] || cities[altSlug] || { lat: 27.5, lng: -82.5 };
    return {
      slug,
      name: cp.name,
      lat: geo.lat || 27.5,
      lng: geo.lng || -82.5
    };
  });
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
