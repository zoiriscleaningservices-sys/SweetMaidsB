import fs from 'fs';
import path from 'path';

export const serviceSlugs = [
  "house-cleaning", "deep-cleaning", "move-in-out-cleaning", "airbnb-cleaning", "commercial-cleaning",
  "post-construction-cleaning", "carpet-cleaning", "pressure-washing", "window-cleaning",
  "home-watch-services", "office-janitorial-services", "janitorial-cleaning-services",
  "medical-dental-facility-cleaning", "industrial-warehouse-cleaning", "floor-stripping-waxing",
  "gym-fitness-center-cleaning", "school-daycare-cleaning", "church-worship-center-cleaning",
  "property-management-janitorial", "luxury-estate-cleaning", "solar-panel-cleaning",
  "gutter-cleaning", "property-maintenance", "airbnb-vacation-rental-management",
  "luxury-estate-management"
];

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
  const current = data[currentSlug] || data['bradenton-fl'];
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
