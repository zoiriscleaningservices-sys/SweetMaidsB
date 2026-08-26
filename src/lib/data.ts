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
  const db = getFloridaMasterDb();

  // 1. Check Cities
  const cities = getLocationData();
  if (cities[cleanSlug]) {
    return {
      name: cities[cleanSlug].name,
      slug: cleanSlug,
      lat: cities[cleanSlug].lat,
      lng: cities[cleanSlug].lng,
      type: 'city'
    };
  }

  // 2. Check Zip Codes (e.g. "33139", "33602")
  if (db?.zip_codes && db.zip_codes[cleanSlug]) {
    const item = db.zip_codes[cleanSlug];
    return {
      name: item.name || `Zip Code ${cleanSlug}`,
      slug: cleanSlug,
      lat: item.lat,
      lng: item.lng,
      type: 'zip',
      parentCity: item.city,
      parentCounty: item.county
    };
  }

  // Pure 5-digit zip fallback
  if (/^\d{5}$/.test(cleanSlug)) {
    return {
      name: `Zip Code ${cleanSlug}`,
      slug: cleanSlug,
      lat: 27.5,
      lng: -82.5,
      type: 'zip',
      parentCity: 'Florida'
    };
  }

  // 3. Check Neighborhoods
  if (db?.neighborhoods && db.neighborhoods[cleanSlug]) {
    const item = db.neighborhoods[cleanSlug];
    return {
      name: item.name,
      slug: cleanSlug,
      lat: item.lat,
      lng: item.lng,
      type: 'neighborhood',
      parentCity: item.city,
      parentCounty: item.county
    };
  }

  // 4. Check Counties
  if (db?.counties && db.counties[cleanSlug]) {
    const item = db.counties[cleanSlug];
    return {
      name: item.name,
      slug: cleanSlug,
      lat: item.lat,
      lng: item.lng,
      type: 'county',
      parentCity: item.seat
    };
  }

  // Fallback: format slug cleanly as city/area
  const formatted = cleanSlug.replace(/-fl$/, '').replace(/-/g, ' ');
  return {
    name: formatName(formatted),
    slug: cleanSlug,
    lat: 27.4989,
    lng: -82.5748,
    type: 'city'
  };
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
  const data = getLocationData();
  const current = resolveAnyLocation(currentSlug);
  if (!current) return [];

  const distances: NearestCity[] = [];
  for (const [slug, city] of Object.entries(data)) {
    if (slug === currentSlug) continue;
    const dist = haversineDistance(current.lat, current.lng, city.lat, city.lng);
    distances.push({
      slug,
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
  const data = getLocationData();
  const list: LocationDirectoryItem[] = Object.entries(data).map(([slug, item]) => ({
    slug,
    name: item.name,
    lat: item.lat,
    lng: item.lng
  }));
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
