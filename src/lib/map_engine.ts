import { resolveAnyLocation } from './data';
import { isMiamiDadeCounty } from './miami_broward_slugs';

export const MIAMI_DADE_GBP_URL = "https://www.google.com/maps/place/Sweet+Maid+Cleaning+Service/data=!4m2!3m1!1s0x0:0x8d09667425e8c230?sa=X&ved=1t:2428&hl=en&ictx=111";
export const BRADENTON_GBP_URL = "https://www.google.com/maps/search/?api=1&query=Sweet+Maid+Cleaning+Service+Bradenton+FL&query_place_id=ChIJXVApokD-1woRwX50Oy2OwHA";

/**
 * Derives the optimal Google Maps search query and zoom level
 * for each individual local zip code, city, neighborhood, or county.
 * STRICT PRIVACY: NEVER output street addresses or private headquarters coordinates.
 */
export function getLocalMapQuery(locSlug: string, cleanName: string): { query: string; zoom: number } {
  const s = (locSlug || '').toLowerCase().trim();

  // 1. If 5-digit zip code
  if (/^\d{5}$/.test(s)) {
    const entity = resolveAnyLocation(s);
    if (entity?.parentCity) {
      return { query: `${s}, ${entity.parentCity}, FL`, zoom: 14 };
    }
    return { query: `${s}, FL`, zoom: 14 };
  }

  // 2. Bradenton home base or home page (Service area only - no street address)
  if (s === 'bradenton-fl' || s === 'home' || !s) {
    return { query: 'Bradenton, FL', zoom: 13 };
  }

  // 3. Miami-Dade municipality or county
  if (isMiamiDadeCounty(s, cleanName)) {
    return { query: `${cleanName}, FL`, zoom: 13 };
  }

  // 4. Specific resolved city, neighborhood, or county
  const entity = resolveAnyLocation(s);
  if (entity) {
    if (entity.type === 'county') {
      return { query: `${entity.name}, FL`, zoom: 11 };
    }
    if (entity.type === 'neighborhood' && entity.parentCity) {
      return { query: `${entity.name}, ${entity.parentCity}, FL`, zoom: 14 };
    }
    return { query: `${entity.name}, FL`, zoom: 13 };
  }

  // 5. Statewide / general service pages
  if (!cleanName || cleanName.toLowerCase() === 'florida') {
    return { query: 'Bradenton, FL', zoom: 12 };
  }

  return { query: `${cleanName}, FL`, zoom: 13 };
}

/**
 * Generates an official, lazy-loaded map embed URL centered on the city with no street pin.
 */
export function generateLocalMapUrl(locSlug: string, cleanName: string, isManatee?: boolean): string {
  const { query, zoom } = getLocalMapQuery(locSlug, cleanName);
  return `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${encodeURIComponent(query)}!6i${zoom}`;
}

/**
 * Generates an authentic direct Google Maps link for the specific location.
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
