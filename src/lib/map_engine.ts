import { resolveAnyLocation } from './data';
import { isMiamiDadeCounty } from './miami_broward_slugs';

export const MIAMI_DADE_GBP_URL = "https://www.google.com/maps/place/Sweet+Maid+Cleaning+Service/data=!4m2!3m1!1s0x0:0x8d09667425e8c230?sa=X&ved=1t:2428&hl=en&ictx=111";
export const BRADENTON_GBP_URL = "https://www.google.com/maps/search/?api=1&query=Sweet+Maid+Cleaning+Service+Bradenton+FL&query_place_id=ChIJXVApokD-1woRwX50Oy2OwHA";

/**
 * Generates a 100% visible, interactive, high-reliability map embed URL
 * centered on the exact latitude & longitude of each individual zip code, city,
 * neighborhood, or county with a prominent red location marker pin.
 *
 * Avoids X-Frame-Options: SAMEORIGIN blocks by using OpenStreetMap/Leaflet
 * while connecting directly to Google Business Profile via the interactive overlay badge.
 */
export function generateLocalMapUrl(locSlug: string, cleanName: string, isManatee?: boolean): string {
  const s = (locSlug || '').toLowerCase().trim();

  let lat = 27.4989;
  let lng = -82.5748;
  let deltaLat = 0.05;
  let deltaLng = 0.07;

  // 1. Bradenton HQ or general homepage
  if (isManatee || s === 'bradenton-fl' || s === 'home') {
    lat = 27.4989;
    lng = -82.5748;
    deltaLat = 0.03;
    deltaLng = 0.04;
  } else {
    // 2. Resolve entity coordinates (zip codes, cities, neighborhoods, counties)
    const entity = resolveAnyLocation(s);
    if (entity && typeof entity.lat === 'number' && typeof entity.lng === 'number') {
      lat = entity.lat;
      lng = entity.lng;

      if (entity.type === 'zip' || /^\d{5}$/.test(s)) {
        // High zoom / tight bounding box for specific zip codes
        deltaLat = 0.025;
        deltaLng = 0.035;
      } else if (entity.type === 'county') {
        deltaLat = 0.15;
        deltaLng = 0.20;
      } else if (entity.type === 'neighborhood') {
        deltaLat = 0.02;
        deltaLng = 0.03;
      } else {
        // Standard city bounding box
        deltaLat = 0.05;
        deltaLng = 0.07;
      }
    } else if (/^\d{5}$/.test(s)) {
      deltaLat = 0.025;
      deltaLng = 0.035;
    }
  }

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

