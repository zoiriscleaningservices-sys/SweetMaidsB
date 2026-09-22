import { resolveAnyLocation } from './data';
import { isMiamiDadeCounty } from './miami_broward_slugs';

export const MIAMI_DADE_GBP_URL = "https://www.google.com/maps/place/Sweet+Maid+Cleaning+Service/data=!4m2!3m1!1s0x0:0x8d09667425e8c230?sa=X&ved=1t:2428&hl=en&ictx=111";
export const BRADENTON_GBP_URL = "https://www.google.com/maps/search/?api=1&query=Sweet+Maid+Cleaning+Service+Bradenton+FL&query_place_id=ChIJXVApokD-1woRwX50Oy2OwHA";

/**
 * Derives the optimal Google Maps search query and zoom level
 * for each individual local zip code, city, neighborhood, or county.
 */
export function getLocalMapQuery(locSlug: string, cleanName: string): { query: string; zoom: number } {
  const s = (locSlug || '').toLowerCase().trim();

  // 1. If 5-digit zip code (e.g. 33139, 34211, 33602...)
  if (/^\d{5}$/.test(s)) {
    const entity = resolveAnyLocation(s);
    if (entity?.parentCity) {
      return { query: `${s}, ${entity.parentCity}, FL`, zoom: 14 };
    }
    return { query: `${s}, FL`, zoom: 14 };
  }

  // 2. If Bradenton HQ or home page
  if (s === 'bradenton-fl' || s === 'home') {
    return { query: 'Sweet Maid Cleaning Service, 14651 Westbrook Cir Apt 312, Bradenton, FL 34211', zoom: 14 };
  }

  // 3. If specific resolved city, neighborhood, or county
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

  // 4. Statewide / general service pages (e.g. house-cleaning, deep-cleaning)
  if (!cleanName || cleanName.toLowerCase() === 'florida') {
    return { query: 'Sweet Maid Cleaning Service, 14651 Westbrook Cir Apt 312, Bradenton, FL 34211', zoom: 14 };
  }

  return { query: `${cleanName}, FL`, zoom: 13 };
}

/**
 * Generates an official Google Map embed URL tailored specifically
 * to each individual zip code, city, neighborhood, or headquarters location.
 */
export function generateLocalMapUrl(locSlug: string, cleanName: string, isManatee?: boolean): string {
  const { query, zoom } = getLocalMapQuery(locSlug, cleanName);
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
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
