import { resolveAnyLocation } from './data';
import { isMiamiDadeCounty } from './miami_broward_slugs';

export const MIAMI_DADE_GBP_URL = "https://www.google.com/maps/place/Sweet+Maid+Cleaning+Service/data=!4m2!3m1!1s0x0:0x8d09667425e8c230?sa=X&ved=1t:2428&hl=en&ictx=111";
export const BRADENTON_GBP_URL = "https://www.google.com/maps/search/?api=1&query=Sweet+Maid+Cleaning+Service+Bradenton+FL&query_place_id=ChIJXVApokD-1woRwX50Oy2OwHA";

/**
 * Generates a high-reliability, responsive OpenStreetMap embed URL
 * centered on the exact latitude & longitude of the city, zip code, or county,
 * featuring an exact location marker pin and calibrated zoom bounding box.
 */
export function generateLocalMapUrl(locSlug: string, cleanName: string, isManatee: boolean): string {
  let lat = 27.4989;
  let lng = -82.5748;

  if (isManatee || locSlug === 'bradenton-fl' || locSlug === 'home') {
    lat = 27.4989;
    lng = -82.5748;
  } else {
    const entity = resolveAnyLocation(locSlug);
    if (entity && typeof entity.lat === 'number' && typeof entity.lng === 'number') {
      lat = entity.lat;
      lng = entity.lng;
    }
  }

  // Calculate high-resolution city bounding box (~10-12km coverage)
  const deltaLng = 0.08;
  const deltaLat = 0.05;
  const minLng = (lng - deltaLng).toFixed(4);
  const minLat = (lat - deltaLat).toFixed(4);
  const maxLng = (lng + deltaLng).toFixed(4);
  const maxLat = (lat + deltaLat).toFixed(4);
  const markerLat = lat.toFixed(4);
  const markerLng = lng.toFixed(4);

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${markerLat}%2C${markerLng}`;
}

/**
 * Generates an authentic direct Google Maps link for the specific location:
 * - Miami-Dade County: official Google Business Profile
 * - Bradenton HQ: official Google Place ID
 * - Other locations: direct Google Maps business search for the local area
 */
export function getGoogleMapsUrl(locSlug: string, cleanName: string, isManatee: boolean, isMiamiDade?: boolean): string {
  const isDade = isMiamiDade ?? isMiamiDadeCounty(locSlug, cleanName);
  if (isDade) {
    return MIAMI_DADE_GBP_URL;
  }
  if (isManatee || locSlug === 'bradenton-fl' || locSlug === 'home') {
    return BRADENTON_GBP_URL;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Sweet Maid Cleaning Service ${cleanName} FL`)}`;
}
