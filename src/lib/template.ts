import fs from 'fs';
import path from 'path';
import { serviceSlugs, formatName, getNearestLocations, resolveAnyLocation } from './data';
import { miamiBrowardSlugs, is305Area, isMonroeCounty, monroeKeyHubs, isMiamiDadeCounty } from './miami_broward_slugs';
import { isManateeCounty, manateeKeyHubs } from './manatee';
import { generateSeoContentPack, formatLocationH1, formatLocationMeta } from './seo_engine';
import { PILOT_LOCATIONS_DATA } from './pilot_locations_data';
import { generateLocalBlogContent } from './blog_engine';
import { generateLocalAboutContent } from './about_engine';
import { generateLocalSeoReviewsHtml } from './reviews_engine';
import { getRegionForCity, getSiblingCities, CORE_SERVICES, CITY_PAGES } from '../config/site-structure';

// Service to H1 mapping using clean transactional search terms
export const serviceH1Map: Record<string, string> = {
  "house-cleaning": "House Cleaning & Maid Services in",
  "deep-cleaning": "Deep House Cleaning & Sanitizing Services in",
  "move-in-out-cleaning": "Move-In & Move-Out Cleaning Services in",
  "airbnb-cleaning": "Airbnb & Vacation Rental Cleaning Services in",
  "commercial-cleaning": "Commercial & Office Cleaning Services in",
  "post-construction-cleaning": "Post-Construction Cleanup Services in",
  "carpet-cleaning": "Professional Carpet & Rug Cleaning Services in",
  "pressure-washing": "Pressure Washing & Exterior Cleaning Services in",
  "window-cleaning": "Professional Window Cleaning Services in",
  "home-watch-services": "Home Watch & Property Care Services in",
  "office-janitorial-services": "Office Cleaning & Janitorial Services in",
  "janitorial-cleaning-services": "Janitorial & Commercial Cleaning Services in",
  "medical-dental-facility-cleaning": "Medical & Dental Facility Cleaning Services in",
  "industrial-warehouse-cleaning": "Industrial & Warehouse Cleaning Services in",
  "floor-stripping-waxing": "Floor Stripping & Waxing Services in",
  "gym-fitness-center-cleaning": "Gym & Fitness Center Cleaning Services in",
  "school-daycare-cleaning": "School & Daycare Cleaning Services in",
  "church-worship-center-cleaning": "Church & Worship Center Cleaning Services in",
  "property-management-janitorial": "Property Management Janitorial Services in",
  "luxury-estate-cleaning": "Luxury Estate Cleaning Services in",
  "solar-panel-cleaning": "Solar Panel Cleaning Services in",
  "gutter-cleaning": "Gutter Cleaning Services in",
  "property-maintenance": "Property Maintenance Services in",
  "recurring-maid-service": "Recurring Maid Service & House Cleaning in"
};

import { generateLocalMapUrl, getGoogleMapsUrl } from './map_engine';
export { generateLocalMapUrl, getGoogleMapsUrl };

export function generatePageImageSchema(cleanName: string, serviceName: string = 'House Cleaning') {
  const isFlorida = cleanName.toLowerCase() === 'florida';
  const locCaption = isFlorida ? 'Florida' : `${cleanName}, FL`;
  const locState = isFlorida ? 'Florida' : `${cleanName}, Florida`;
  return [
    {
      "@type": "ImageObject",
      "url": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-11.18.08-pm.webp",
      "name": `Spotless Modern Kitchen Cleaning in ${cleanName}`,
      "caption": `Professional residential kitchen cleaning and sanitization in ${locCaption}`,
      "description": `Sweet Maid professional cleaning crew detailing and polishing kitchen countertops and stainless steel appliances in ${locState}.`,
      "contentUrl": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-11.18.08-pm.webp"
    },
    {
      "@type": "ImageObject",
      "url": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-11.18.07-pm-1.webp",
      "name": `Sanitized Luxury Master Bathroom Deep Cleaning in ${cleanName}`,
      "caption": `Pristine sanitized bathroom tile, shower glass, and vanity in ${locCaption}`,
      "description": `Comprehensive bathroom sanitizing, tile grout scrubbing, and fixture polishing by Sweet Maid in ${locState}.`,
      "contentUrl": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-11.18.07-pm-1.webp"
    },
    {
      "@type": "ImageObject",
      "url": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-11.18.08-pm-1.webp",
      "name": `Pristine Hardwood Living Room Move-In Cleaning in ${cleanName}`,
      "caption": `Pristine hardwood floor detailing and move-in deep cleaning in ${locCaption}`,
      "description": `Move-in and move-out turnover deep clean with HEPA vacuuming and wood floor detailing in ${locState}.`,
      "contentUrl": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-11.18.08-pm-1.webp"
    },
    {
      "@type": "ImageObject",
      "url": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-3.46.50-pm.webp",
      "name": `Commercial Office Suite and Janitorial Cleaning in ${cleanName}`,
      "caption": `Spotless commercial workspace and executive suite cleaning in ${locCaption}`,
      "description": `Professional commercial office cleaning, workspace sanitation, and janitorial services for ${cleanName} businesses.`,
      "contentUrl": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-3.46.50-pm.webp"
    },
    {
      "@type": "ImageObject",
      "url": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-11-at-12.07.26-pm.webp",
      "name": `Post-Construction Dust Extraction Cleaning in ${cleanName}`,
      "caption": `Detailed post-construction debris and dust removal in ${locCaption}`,
      "description": `Contractor turnover and post-construction fine dust HEPA extraction for ${locState} properties.`,
      "contentUrl": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-11-at-12.07.26-pm.webp"
    },
    {
      "@type": "ImageObject",
      "url": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-11.17.59-pm.webp",
      "name": `Airbnb and Vacation Rental Turnover Cleaning in ${cleanName}`,
      "caption": `Guest turnover cleaning and sanitization in ${locCaption}`,
      "description": `Rapid Airbnb turnover cleaning, guest amenity staging, and bathroom sanitization in ${locState}.`,
      "contentUrl": "https://www.sweetmaidcleaning.com/images/whatsapp-image-2026-02-10-at-11.17.59-pm.webp"
    }
  ];
}

export function processPageImages(
  html: string,
  clean_name: string,
  loc_slug: string,
  serviceName: string,
  pageType: string
): string {
  const isLogin = pageType === 'login';
  const usedAlts = new Set<string>();
  let heroImageHandled = false;
  let googleReviewCounter = 0;
  let logoCounter = 0;

  const locStateStr = (c: string) => c.toLowerCase() === 'florida' ? 'Florida' : `${c}, FL`;

  const imageLocalSeoMap: Record<string, (c: string, s: string) => string> = {
    'whatsapp-image-2026-02-10-at-11.18.07-pm-1': (c, s) =>
      isLogin ? 'Deep Cleaning Sanitized Master Bathroom & Tile Grout' : `Sanitized Luxury Master Bathroom and Tile Grout Cleaning in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.07-pm': (c, s) =>
      isLogin ? 'Luxury High-Rise Condo Deep Cleaning & Disinfection' : `Luxury High-Rise Condo Deep Cleaning and Disinfection in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.08-pm-1': (c, s) =>
      isLogin ? 'Pristine Living Room Move-In Cleaning Service' : `Pristine Hardwood Living Room Move-In Cleaning in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.08-pm-2': (c, s) =>
      isLogin ? 'Sparkling Clean Walk-in Glass Shower & Descaled Tile' : `Sparkling Clean Walk-in Glass Shower and Descaled Tile in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.08-pm-3': (c, s) =>
      isLogin ? 'Complete Move-Out Vacancy Turnover Cleaning' : `Move-Out Vacancy Turnover Deep Cleaning Inspection in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.08-pm-4': (c, s) =>
      isLogin ? 'Luxury Soaking Tub & Spa Vanity Sanitization' : `Luxury Soaking Tub and Spa Vanity Deep Sanitization in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.08-pm': (c, s) =>
      isLogin ? 'Spotless Modern Kitchen Sanitization & Detailing' : `Spotless Modern Kitchen Sanitization and Appliance Detailing in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.09-pm-1': (c, s) =>
      isLogin ? 'Vacation Rental Bedroom Staging & Linen Setup' : `Vacation Rental Bedroom Staging and Fresh Linen Setup in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.09-pm-2': (c, s) =>
      isLogin ? 'Living Room Micro-Dusting & Furniture Polishing' : `Detailed Living Room Micro-Dusting and Furniture Polishing in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.09-pm-3': (c, s) =>
      isLogin ? 'Custom Cabinetry & Countertop Detailing' : `Custom Cabinetry and Marble Countertop Detailing in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.09-pm': (c, s) =>
      isLogin ? 'Modern Island Kitchen Scrubbing & Polishing' : `Modern Island Kitchen Deep Scrubbing and Polishing in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.18.06-pm': (c, s) =>
      isLogin ? 'Gourmet Kitchen Stove Degreasing & Detailing' : `Gourmet Kitchen Stove Degreasing and Countertop Detailing in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-3.46.50-pm': (c, s) =>
      isLogin ? 'Commercial Office Suite Janitorial Cleaning' : `Commercial Office Suite and Professional Janitorial Cleaning in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-3.47.15-pm': (c, s) =>
      isLogin ? 'Waterfront Condo Living Room HEPA Detailing' : `Waterfront Condo Living Room HEPA Vacuuming and Detailing in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-11-at-12.07.26-pm': (c, s) =>
      isLogin ? 'Post-Construction Fine Dust Extraction Cleaning' : `Post-Construction Fine Dust Extraction and Renovation Cleanup in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.17.59-pm': (c, s) =>
      isLogin ? 'Airbnb Vacation Rental Bathroom Turnover Cleaning' : `Airbnb Vacation Rental Turnover Cleaning and Bathroom Staging in ${locStateStr(c)}`,
    'whatsapp-image-2026-02-10-at-11.17.58-pm': (c, s) =>
      isLogin ? 'Exterior Pressure Washing & Surface Soft Wash' : `Exterior Pressure Washing and Lanai Pool Deck Soft Wash in ${locStateStr(c)}`,
    'carpet-cleaning': (c, s) =>
      isLogin ? 'Deep Steam Extraction Carpet Cleaning' : `Deep Steam Extraction Carpet and Area Rug Cleaning in ${locStateStr(c)}`,
    'window-cleaning': (c, s) =>
      isLogin ? 'Interior & Exterior Streak-Free Window Cleaning' : `Interior and Exterior Streak-Free Window Cleaning in ${locStateStr(c)}`,
  };

  const sortedKeys = Object.keys(imageLocalSeoMap).sort((a, b) => b.length - a.length);

  const googleBadges: ((c: string) => string)[] = [
    c => isLogin ? 'Google Verified Customer Rating' : `Google Verified Rating - Sweet Maid ${c}`,
    c => isLogin ? 'Google Customer Review Rating Badge' : `Google Customer Review Rating Badge - ${c}, FL`,
    c => isLogin ? 'Google Verified Maid Service Review' : `Google Verified Maid Service Review - ${c}`,
    c => isLogin ? 'Google Verified Cleaning Testimonial' : `Google Verified Cleaning Testimonial - ${c}, FL`,
    c => isLogin ? 'Google Verified Cleaning Service Feedback' : `Google Verified Cleaning Service Rating - ${c}`,
    c => isLogin ? 'Google House Cleaning Feedback' : `Google Verified House Cleaning Review - ${c}, FL`,
    c => isLogin ? 'Google Business Verified Review Rating' : `Google Business Verified Rating - Sweet Maid ${c}`,
  ];

  return html.replace(/<img\s+([^>]+)>/gi, (fullMatch, rawAttrs) => {
    let attrs = rawAttrs.replace(/\/+$/, '').trim();

    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    let src = srcMatch ? srcMatch[1] : '';
    let srcLower = src.toLowerCase();

    // 1. Eliminate external Unsplash hotlinks and map to local WebP assets
    if (srcLower.includes('images.unsplash.com')) {
      if (srcLower.includes('1628177142898') || srcLower.includes('carpet')) {
        src = '/images/carpet-cleaning.webp';
      } else if (srcLower.includes('1527515637462') || srcLower.includes('window')) {
        src = '/images/window-cleaning.webp';
      } else {
        src = '/images/carpet-cleaning.webp';
      }
      attrs = attrs.replace(/src=["'][^"']+["']/i, `src="${src}"`);
      srcLower = src.toLowerCase();
    } else if (src.startsWith('/images/') || src.startsWith('../../images/') || src.startsWith('../images/')) {
      // Normalize relative paths to /images/
      if (src.startsWith('../../images/') || src.startsWith('../images/')) {
        src = src.replace(/^(\.\.\/)+images\//, '/images/');
        attrs = attrs.replace(/src=["'][^"']+["']/i, `src="${src}"`);
      }
      // Convert .jpeg, .jpg, .png to .webp
      if (srcLower.endsWith('.jpeg') || srcLower.endsWith('.jpg') || srcLower.endsWith('.png')) {
        src = src.replace(/\.(jpeg|jpg|png)$/i, '.webp');
        attrs = attrs.replace(/src=["'][^"']+["']/i, `src="${src}"`);
      }
      srcLower = src.toLowerCase();
    }

    // Normalize srcset relative paths if any
    const srcsetMatch = attrs.match(/srcset=["']([^"']+)["']/i);
    if (srcsetMatch && (srcsetMatch[1].includes('../../images/') || srcsetMatch[1].includes('../images/'))) {
      const normalizedSrcset = srcsetMatch[1].replace(/(\.\.\/)+images\//g, '/images/');
      attrs = attrs.replace(/srcset=["'][^"']+["']/i, `srcset="${normalizedSrcset}"`);
    }

    // Add decoding="async" for non-blocking main-thread decoding
    if (!attrs.includes('decoding=')) {
      attrs += ' decoding="async"';
    }

    // Ensure explicit dimensions to prevent CLS
    if (!attrs.includes('width=') && !attrs.includes('height=')) {
      if (srcLower.includes('google') || srcLower.includes('ui-avatars')) {
        attrs += ' width="48" height="48"';
      } else if (srcLower.includes('logo')) {
        attrs += ' width="200" height="60"';
      } else {
        attrs += ' width="800" height="600"';
      }
    }

    // Loading strategy:
    // Hero image (or explicit fetchpriority="high"): NOT lazy-loaded, fetchpriority="high"
    // Header logo: NOT lazy-loaded, no fetchpriority="high"
    // All other images: loading="lazy", no fetchpriority="high"
    const isHeroImage = attrs.includes('fetchpriority="high"') || attrs.includes('hero') || attrs.includes('banner');
    if (isHeroImage) {
      heroImageHandled = true;
      attrs = attrs.replace(/\s*loading=["'][^"']*["']/gi, '');
      if (!attrs.includes('fetchpriority=')) {
        attrs += ' fetchpriority="high"';
      }
    } else if (srcLower.includes('logo') && !srcLower.includes('google')) {
      attrs = attrs.replace(/\s*fetchpriority=["'][^"']*["']/gi, '');
      attrs = attrs.replace(/\s*loading=["'][^"']*["']/gi, '');
    } else {
      attrs = attrs.replace(/\s*fetchpriority=["'][^"']*["']/gi, '');
      if (!attrs.includes('loading=')) {
        attrs += ' loading="lazy"';
      }
    }

    let targetAlt = '';

    const existingAltMatch = attrs.match(/alt=["']([^"']*)["']/i);
    const existingAlt = existingAltMatch ? existingAltMatch[1].trim() : '';

    if (clean_name.toLowerCase() === 'florida' && existingAlt && !existingAlt.toLowerCase().includes('google') && !existingAlt.toLowerCase().includes('logo') && existingAlt.length > 10) {
      // Honor descriptive alt texts on Florida pages without city claiming
      targetAlt = existingAlt;
    } else if (srcLower.includes('google') || srcLower.includes('wikipedia.org/wikipedia/commons/c/c1/google')) {
      const badgeFn = googleBadges[googleReviewCounter % googleBadges.length];
      targetAlt = badgeFn(clean_name);
      googleReviewCounter++;
    } else if (srcLower.includes('ui-avatars.com')) {
      const nameMatch = src.match(/name=([^&"']+)/i);
      const reviewerName = nameMatch ? decodeURIComponent(nameMatch[1]).replace(/\+/g, ' ') : 'Verified Client';
      targetAlt = isLogin
        ? `Verified Customer Review by ${reviewerName}`
        : `Verified Customer Review by ${reviewerName} - Sweet Maid ${clean_name}`;
    } else if (srcLower.includes('logo')) {
      logoCounter++;
      if (logoCounter === 1) {
        targetAlt = isLogin
          ? 'Sweet Maid Professional Cleaning Service'
          : `Sweet Maid Cleaning Service - Professional Cleaning Company in ${clean_name}, FL`;
      } else if (logoCounter === 2) {
        targetAlt = isLogin
          ? 'Sweet Maid Cleaning Service Portal Navigation'
          : `Sweet Maid Cleaning Service Mobile Navigation - ${clean_name}, FL`;
      } else {
        targetAlt = isLogin
          ? 'Sweet Maid Professional Cleaning Services'
          : `Sweet Maid Cleaning Service - Professional Cleaners in ${clean_name}, Florida`;
      }
    } else {
      let matchedKey = '';
      for (const key of sortedKeys) {
        if (srcLower.includes(key)) {
          matchedKey = key;
          break;
        }
      }

      if (!matchedKey) {
        if (srcLower.includes('photo-1628177142898') || srcLower.includes('carpet')) {
          matchedKey = 'carpet-cleaning';
        } else if (srcLower.includes('photo-1527515637462') || srcLower.includes('window')) {
          matchedKey = 'window-cleaning';
        }
      }

      if (matchedKey && imageLocalSeoMap[matchedKey]) {
        targetAlt = imageLocalSeoMap[matchedKey](clean_name, serviceName);
      } else {
        const existingAltMatch = attrs.match(/alt=["']([^"']*)["']/i);
        let existing = existingAltMatch ? existingAltMatch[1] : '';
        existing = existing
          .replace(/\s*-\s*Bradenton,?\s*FL/gi, '')
          .replace(/\s*-\s*Top.*$/gi, '')
          .replace(/Bradenton/gi, clean_name)
          .trim();

        const isFlorida = clean_name.toLowerCase() === 'florida';
        const locDisplay = isFlorida ? 'Florida' : `${clean_name}, FL`;

        if (existing && existing !== 'Google' && !existing.toLowerCase().includes('logo')) {
          targetAlt = isLogin ? existing : `${existing} in ${locDisplay}`;
        } else {
          targetAlt = isLogin
            ? `${serviceName} Professional Service`
            : `${serviceName} by Sweet Maid in ${locDisplay}`;
        }
      }
    }

    // Guarantee 100% uniqueness: Zero duplicated alt texts on the same page
    let finalAlt = targetAlt;
    let duplicateIndex = 2;
    while (usedAlts.has(finalAlt)) {
      finalAlt = `${targetAlt} - View ${duplicateIndex}`;
      duplicateIndex++;
    }
    usedAlts.add(finalAlt);

    if (attrs.includes('alt=')) {
      attrs = attrs.replace(/alt=["'][^"']*["']/i, `alt="${finalAlt}"`);
    } else {
      attrs += ` alt="${finalAlt}"`;
    }

    return `<img ${attrs.trim().replace(/\s{2,}/g, ' ')}>`;
  });
}

export function getTemplate(templateName: string) {
  try {
    const isService = serviceSlugs.includes(templateName);
    const folder = isService ? "services_source/" + templateName : templateName;
    const filePath = path.join(process.cwd(), 'templates', folder, 'index.html');
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

export function extractSections(html: string) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  
  if (bodyMatch && bodyMatch[1]) {
    return bodyMatch[1].trim();
  }
  
  return html;
}

export function exportHead(html: string) {
  const match = html.match(/<head[\s\S]*?>([\s\S]*?)<\/head>/i);
  return match ? match[1] : '';
}

export function localizedReplace(content: string, clean_name: string, loc_slug: string, is_sub_page = false, currentService: string = 'cleaning') {
  if (!content) return '';
  
  let newContent = content;
  let serviceName = currentService.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  if (!serviceName.toLowerCase().endsWith('services')) {
    serviceName += ' Services';
  }


  // 1. Detect page type based on original H1 or content signatures before general replacements
  const originalH1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let pageType = 'service_or_home';
  if (currentService === 'blog') {
    pageType = 'blog';
  } else if (currentService === 'about') {
    pageType = 'about';
  }
  
  if (originalH1Match) {
    const innerH1 = originalH1Match[1].trim();
    if (innerH1.includes('About Sweet Maid Cleaning') || innerH1.includes('About Sweet Maid')) {
      pageType = 'about';
    } else if (innerH1.includes('Our Cleaning Results') || innerH1.includes('Service Gallery')) {
      pageType = 'gallery';
    } else if (innerH1.includes('Welcome Back') || innerH1.includes('login') || innerH1.includes('Client Portal') || innerH1.includes('Cleaning Portal') || innerH1.includes('shining home') || content.includes('bookingkoala.com/login')) {
      pageType = 'login';
    } else if (innerH1.includes('Blog') || innerH1.includes('Cleaning Guides') || content.includes('Florida Cleaning Blog') || content.includes('sweet-maid-blog-hub') || content.includes('truewebx-blog-heading')) {
      pageType = 'blog';
    }
  }

  if (content.includes('bookingkoala.com/login')) {
    pageType = 'login';
  } else if (content.includes('sweet-maid-blog-hub') || content.includes('truewebx-blog-heading') || content.includes('data-filter="florida-keys"') || content.includes('Florida Cleaning Blog')) {
    pageType = 'blog';
  }

  // Generate 100% Unique, Zero-Duplicate SEO Content Pack
  const isCityHub = !is_sub_page && loc_slug && loc_slug !== 'home' && !serviceSlugs.includes(loc_slug);
  const effectiveServiceSlug = isCityHub ? 'cleaning' : ((pageType === 'about' || currentService === 'about') ? 'house-cleaning' : currentService);
  const effectiveServiceName = isCityHub ? 'Cleaning Services' : ((pageType === 'about' || currentService === 'about') ? 'House Cleaning' : serviceName);
  const seoPack = generateSeoContentPack(clean_name, loc_slug, effectiveServiceName, effectiveServiceSlug);

  // Strip all data-aos animation attributes to guarantee 100% visibility of all sections
  newContent = newContent.replace(/\s*data-aos(?:-[a-z0-9-]+)?="[^"]*"/gi, '');
  newContent = newContent.replace(/AOS\.init\([^)]*\);?/gi, "if(typeof AOS!=='undefined'){AOS.init();}");

  // Dynamic Safe Text Replacements for body without destroying HTML tags
  newContent = newContent.replace(/Best Cleaning Services in/gi, `${serviceName} in`);
  newContent = newContent.replace(/House Cleaning Services in/gi, `${serviceName} in`);
  newContent = newContent.replace(/House Cleaning in/gi, `${serviceName} in`);

  // Strip ALL legacy favicon tags from templates to prevent Next.js Vercel Triangle fallback
  newContent = newContent.replace(/<link rel="icon"[^>]*>/gi, '');
  newContent = newContent.replace(/<link rel="apple-touch-icon"[^>]*>/gi, '');
  newContent = newContent.replace(/<link rel="shortcut icon"[^>]*>/gi, '');
  
  if (pageType === 'login') {
    // Zero-City Policy for Login Page: Pure cleaning services keywords only
    newContent = newContent.replace(/(?:#1\s+Rated|Top-Rated|5-Star\s+Rated)\s+Cleaning\s+Service\s+in\s+Bradenton/gi, 'Professional Maid & Cleaning Services');
    newContent = newContent.replace(/(?:#1\s+Rated|Top-Rated|5-Star\s+Rated)\s+Cleaning\s+Service\s+in\s+[^<|]+/gi, 'Professional Maid & Cleaning Services ');
    newContent = newContent.replace(/Bradenton's most trusted cleaning service/gi, 'Your trusted professional cleaning company');
    newContent = newContent.replace(/Bradenton, FL/gi, '');
    newContent = newContent.replace(/in Bradenton/gi, '');
    newContent = newContent.replace(/Bradenton/gi, '');
    newContent = newContent.replace(/Trusted by Florida/gi, 'Trusted Professional Cleaners');
    // Ensure image alt tags focus on cleaning services without city tagging
    newContent = newContent.replace(/alt="([^"]*)"/gi, (match, p1) => {
      const cleanAlt = p1.replace(/\s*-\s*Bradenton,?\s*FL/gi, '').replace(/\s*-\s*Top.*$/gi, '');
      return `alt="${cleanAlt.trim()}"`;
    });
  } else if (pageType === 'blog') {
    // Florida Regional Blog Hub: Preserve authentic regional titles, cities, and internal linking
    const blogTopBanner = (loc_slug && loc_slug !== 'home' && is_sub_page)
      ? `Professional Cleaning Services in ${clean_name}, FL`
      : `Professional Cleaning Services in Florida`;
    newContent = newContent.replace(/(?:#1\s+Rated\s+Cleaning\s+Service\s+in\s+Bradenton|5-Star Rated Cleaning Service in Florida|Top-Rated Cleaning & Maid Services in Florida)/gi, blogTopBanner);
    newContent = newContent.replace(/(?:Bradenton's|Florida's)\s*most trusted cleaning service/gi, "Florida's family-owned cleaning service");
    newContent = newContent.replace(/Why Locals Trust Us/gi, `Why Florida Homeowners Trust Us`);
    newContent = newContent.replace(/Why Florida Trusts Us/gi, `Why Florida Homeowners Trust Us`);

    // Dedicated phone routing for South Florida & Florida Keys
    if (is305Area(loc_slug, clean_name)) {
      newContent = newContent.replace(/\(941\)\s*222-2080/g, '(305) 851-6959');
      newContent = newContent.replace(/tel:1?9412222080/g, 'tel:13058516959');
    }

    // If viewing a localized city blog page (is_sub_page and loc_slug), inject the dedicated local blog article & local Google map
    if (loc_slug && loc_slug !== 'home' && is_sub_page) {
      const localBlogHtml = generateLocalBlogContent(clean_name, loc_slug);
      // Demote regional hub heading to h2 on local pages for semantic SEO hierarchy
      newContent = newContent.replace(/<h1 id="truewebx-blog-heading"([^>]*)>([\s\S]*?)<\/h1>/i, '<h2 id="truewebx-blog-heading"$1>Explore Statewide Florida Regional Guides</h2>');
      if (newContent.includes('id="sweet-maid-blog-hub"')) {
        newContent = newContent.replace(/<section[^>]*id="sweet-maid-blog-hub"/i, localBlogHtml + '\n<section id="sweet-maid-blog-hub"');
      } else {
        newContent = localBlogHtml + '\n' + newContent;
      }

      // Localize bottom Services Carousel and local authority links to this specific city
      newContent = newContent.replace(
        /href="\/([a-z0-9-]+-cleaning|recurring-maid-service|pressure-washing|office-janitorial-services|janitorial-cleaning-services|medical-dental-facility-cleaning|industrial-warehouse-cleaning|gym-fitness-center-cleaning|school-daycare-cleaning|church-worship-center-cleaning|property-management-janitorial|floor-stripping-waxing|solar-panel-cleaning|gutter-cleaning|property-maintenance|home-watch-services)\/"/g,
        `href="/$1-${loc_slug}/"`
      );

      // Localize bottom hyper-local SEO block
      newContent = newContent.replace(/House Cleaning in Bradenton\s*fl/gi, `House Cleaning in ${clean_name}, FL`);
      newContent = newContent.replace(/Bradenton\s*House Cleaning/gi, `${clean_name} House Cleaning`);
      newContent = newContent.replace(/Providing Top-Tier House Cleaning in\s+Bradenton\s*FL/gi, `Providing Top-Tier House Cleaning in ${clean_name}, FL`);
      newContent = newContent.replace(/space in Bradenton,\s*FL/gi, `space in ${clean_name}, FL`);
      newContent = newContent.replace(/Bradenton residents/gi, `${clean_name} residents`);
      newContent = newContent.replace(/free Bradenton House Cleaning quote/gi, `free ${clean_name} House Cleaning quote`);
    } else {
      // On statewide /blog/ hub, ensure adequate top clearance below fixed header
      newContent = newContent.replace(
        /(<section[^>]*id="sweet-maid-blog-hub"[^>]*class="[^"]*)"/i,
        '$1" style="padding-top: clamp(120px, 14vh, 160px);"'
      );
    }
  } else if (pageType === 'about') {
    // Dedicated phone routing for South Florida & Florida Keys
    if (is305Area(loc_slug, clean_name)) {
      newContent = newContent.replace(/\(941\)\s*222-2080/g, '(305) 851-6959');
      newContent = newContent.replace(/tel:1?9412222080/g, 'tel:13058516959');
    }

    const localAboutHtml = generateLocalAboutContent(clean_name, loc_slug);

    // Replace the legacy mini hero and generic text with our rich local authority article
    const aboutHeroRegex = /<!--\s*={10,}\s*MINI HERO \(about\.html\)[\s\S]*?<!--\s*={10,}\s*SERVICES CAROUSEL/i;
    if (aboutHeroRegex.test(newContent)) {
      newContent = newContent.replace(aboutHeroRegex, localAboutHtml + '\n<!-- SERVICES CAROUSEL');
    } else {
      newContent = newContent.replace(/<section[^>]*class="[^"]*bg-pink-50[\s\S]*?<section[^>]*id="services"/i, localAboutHtml + '\n<section overflow-hidden id="services"');
    }

    // Localize bottom Services Carousel and local authority links to this specific city
    newContent = newContent.replace(
      /href="\/([a-z0-9-]+-cleaning|recurring-maid-service|pressure-washing|office-janitorial-services|janitorial-cleaning-services|medical-dental-facility-cleaning|industrial-warehouse-cleaning|gym-fitness-center-cleaning|school-daycare-cleaning|church-worship-center-cleaning|property-management-janitorial|floor-stripping-waxing|solar-panel-cleaning|gutter-cleaning|property-maintenance|home-watch-services)\/"/g,
      `href="/$1-${loc_slug}/"`
    );

    // Aggressive SEO location targeting for any residual text
    newContent = newContent.replace(/Bradenton's/gi, `${clean_name}'s`).replace(/Bradenton’s/gi, `${clean_name}'s`);
    newContent = newContent.replace(/Bradenton, FL/gi, `${clean_name}, FL`);
    newContent = newContent.replace(/Bradenton/gi, clean_name);
  } else {
    // Aggressive SEO location and service targeting
    newContent = newContent.replace(/Bradenton’s/gi, `${clean_name}'s`).replace(/Bradenton's/gi, `${clean_name}'s`);
    newContent = newContent.replace(/across Bradenton and Southwest Florida/gi, `across ${clean_name} and Southwest Florida`);
    newContent = newContent.replace(/in Bradenton home/gi, `in ${clean_name} home`);
    newContent = newContent.replace(/Favorite Cleaners in Bradenton/gi, `Favorite Cleaners in ${clean_name}`);
    newContent = newContent.replace(/Top Rated in Bradenton/gi, `Cleaners in ${clean_name}`);
    newContent = newContent.replace(/Cleaning Service in Bradenton/gi, `${serviceName} in ${clean_name}`);
    newContent = newContent.replace(/Cleaning Service in Florida/gi, `${serviceName} in ${clean_name}`);
    newContent = newContent.replace(/house cleaning Bradenton/gi, `${serviceName.toLowerCase()} ${clean_name}`);
    newContent = newContent.replace(/maid service Bradenton/gi, `${serviceName.toLowerCase()} ${clean_name}`);
    newContent = newContent.replace(/House Cleaning in Florida FL/gi, `${serviceName} in ${clean_name}, FL`);
    newContent = newContent.replace(/in House, FL/gi, `in ${clean_name}, FL`);
    newContent = newContent.replace(/House, FL/gi, `${clean_name}, FL`);
    newContent = newContent.replace(/Bradenton, FL/gi, `${clean_name}, FL`);
    newContent = newContent.replace(/Bradenton/gi, clean_name);
    
    // Restore static external URLs that contain "bradenton"
    newContent = newContent.replace(/https:\/\/www\.yelp\.com\/biz\/sweet-maid-cleaning-service-[^/"]+-3/gi, 'https://www.yelp.com/biz/sweet-maid-cleaning-service-bradenton-3');
    newContent = newContent.replace(/\/florida-fl\/?/gi, '/bradenton-fl/');
    newContent = newContent.replace(/\/Florida-fl\/?/gi, '/bradenton-fl/');
    newContent = newContent.replace(/\/Bradenton-fl\/?/gi, '/bradenton-fl/');
    newContent = newContent.replace(/\/Florida\//gi, '/');
    
    // Inject exact keyword into generic paragraph descriptions to fulfill "top to bottom" request
    newContent = newContent.replace(/Why Florida Trusts Us/gi, `Why ${clean_name} Trusts Us`);
    newContent = newContent.replace(/Why Locals Trust Us/gi, `Why ${clean_name} Trusts Us`);
    newContent = newContent.replace(/(?:Bradenton's|Florida's|[A-Za-z\s]+'s)\s*most trusted cleaning service/gi, `${clean_name}'s family-owned cleaning service`);
    newContent = newContent.replace(/Florida's most trusted cleaning service/gi, `${clean_name}'s family-owned cleaning service`);
    newContent = newContent.replace(/Professional, reliable, and friendly cleaning services for Florida and surrounding areas/gi, `Professional, reliable, and friendly ${serviceName.toLowerCase()} for ${clean_name} and surrounding areas`);

    // Master Prompt v3 Template Bug Fixes
    newContent = newContent.replace(/[^.]+?'s premier cleaning solutions/gi, 'Professional cleaning solutions');
    newContent = newContent.replace(/premier cleaning solutions/gi, 'cleaning solutions');
    newContent = newContent.replace(/across Florida and [A-Za-z\s]+?\./gi, 'across Florida.');
    newContent = newContent.replace(/across Florida and [A-Za-z\s]+?,/gi, 'across Florida,');
    newContent = newContent.replace(/\bdeep\s+deep\b/gi, 'deep');
    newContent = newContent.replace(/From the beaches to the ranch,?\s*(?:our teams are in your neighborhood daily\.\s*We treat your community like our own\.)?/gi, `Serving homes and businesses across ${clean_name} and nearby Florida communities.`);
    newContent = newContent.replace(/From the beaches to the ranch/gi, `Across ${clean_name}`);
    newContent = newContent.replace(/14651 Westbrook Cir(?: Apt 312)?, Bradenton, FL(?: 34211)?/gi, `Serving ${clean_name} and nearby Florida communities`);
    newContent = newContent.replace(/Westbrook/gi, '');
    newContent = newContent.replace(/\b34211\b/g, '');

    if (clean_name.toLowerCase() === 'florida') {
      newContent = newContent.replace(/Florida,\s*FL/gi, 'Florida');
      newContent = newContent.replace(/in Florida home\b/gi, 'in Florida homes');
      newContent = newContent.replace(/House Cleaning in Florida FL/gi, 'House Cleaning in Florida');
      newContent = newContent.replace(/in House, FL/gi, 'in Florida');
      newContent = newContent.replace(/across Florida and Southwest Florida/gi, 'across Florida');
      newContent = newContent.replace(/Serving homes and businesses across Florida and nearby Florida communities/gi, 'Serving homes and businesses across Florida communities');
      newContent = newContent.replace(/Serving Florida and nearby Florida communities/gi, 'Serving communities across Florida');
      newContent = newContent.replace(/Serving Florida &amp; Nearby:/gi, 'Serving Florida Communities:');
    }
  }
  
  // Purge any references to non-working / decommissioned service pages from header, mobile menu, and footer
  newContent = newContent.replace(/<li[^>]*>\s*<a\s+[^>]*href="[^"]*(?:airbnb-vacation-rental-management|luxury-estate-management)[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/li>/gi, '');
  newContent = newContent.replace(/<a\s+[^>]*href="[^"]*(?:airbnb-vacation-rental-management|luxury-estate-management)[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

  // Clean, 8-8-8 Aligned Header Services Mega Menu
  const alignedMegaMenuHtml = `<!-- Services Dropdown (Mega Menu) -->
          <div class="nav-dropdown">
            <a href="/services/"
              class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors py-8"
              aria-label="Florida Cleaning Services Directory">
              Services <i class="fa-solid fa-chevron-down text-xs"></i>
            </a>
            <div
              class="dropdown-menu -left-32 w-[800px] bg-white rounded-3xl shadow-2xl border border-pink-100 p-8 mt-0">
              <div class="grid grid-cols-3 gap-8">
                <!-- Residential Column -->
                <div>
                  <div class="text-xs font-bold text-pink-600 uppercase tracking-wider mb-4 px-2">Residential &
                    Management</div>
                  <div class="space-y-1">
                    <a href="/house-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">House
                      Cleaning</a>
                    <a href="/deep-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Deep
                      Cleaning</a>
                    <a href="/recurring-maid-service/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Recurring
                      Maid Service</a>
                    <a href="/move-in-out-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Move
                      In/Out Cleaning</a>
                    <a href="/airbnb-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Airbnb
                      Cleaning</a>
                    <a href="/home-watch-services/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Home
                      Watch Services</a>
                    <a href="/luxury-estate-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Luxury
                      Estate Cleaning</a>
                    <a href="/property-management-janitorial/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Property
                      Management Janitorial</a>
                  </div>
                </div>
                <!-- Commercial Column -->
                <div>
                  <div class="text-xs font-bold text-pink-600 uppercase tracking-wider mb-4 px-2">Commercial &
                    Janitorial</div>
                  <div class="space-y-1">
                    <a href="/commercial-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Commercial
                      Cleaning</a>
                    <a href="/office-janitorial-services/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Office
                      Janitorial Services</a>
                    <a href="/janitorial-cleaning-services/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Janitorial
                      Cleaning Services</a>
                    <a href="/medical-dental-facility-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Medical
                      & Dental Cleaning</a>
                    <a href="/industrial-warehouse-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Industrial
                      & Warehouse</a>
                    <a href="/gym-fitness-center-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Gym
                      & Fitness Center</a>
                    <a href="/school-daycare-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">School
                      & Daycare Cleaning</a>
                    <a href="/church-worship-center-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Church
                      & Worship Center</a>
                  </div>
                </div>
                <!-- Specialized Column -->
                <div>
                  <div class="text-xs font-bold text-pink-600 uppercase tracking-wider mb-4 px-2">Specialized &
                    Maintenance</div>
                  <div class="space-y-1">
                    <a href="/post-construction-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Post-Construction</a>
                    <a href="/pressure-washing/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Pressure
                      Washing</a>
                    <a href="/carpet-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Carpet
                      Cleaning</a>
                    <a href="/window-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Window
                      Cleaning</a>
                    <a href="/floor-stripping-waxing/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Floor
                      Stripping & Waxing</a>
                    <a href="/solar-panel-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Solar
                      Panel Cleaning</a>
                    <a href="/gutter-cleaning/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Gutter
                      Cleaning</a>
                    <a href="/property-maintenance/"
                      class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Property
                      Maintenance</a>
                  </div>
                </div>
              </div>
              <div class="pt-5 mt-6 border-t border-pink-100 flex items-center justify-between">
                <a href="/services/" class="text-xs font-bold text-pink-500 hover:text-pink-700 uppercase tracking-widest transition flex items-center gap-2 group" aria-label="Explore all Florida cleaning services">
                  <span>View All 24 Professional Cleaning Services</span>
                  <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </a>
                <a href="/locations/" class="text-xs font-bold text-gray-500 hover:text-pink-500 uppercase tracking-widest transition flex items-center gap-1.5" aria-label="Browse Florida cleaning locations directory">
                  <i class="fa-solid fa-location-dot text-pink-400"></i>
                  <span>Browse Florida Locations</span>
                </a>
              </div>
            </div>
          </div>\n          `;

  const alignedMobileServicesHtml = `<!-- Top Quick Link to All Services -->
              <a href="/services/"
                class="mobile-link flex items-center justify-between p-3.5 mb-2 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold text-sm shadow-md shadow-pink-200 active:scale-95 transition-all">
                <span class="flex items-center gap-2.5">
                  <i class="fa-solid fa-sparkles"></i>
                  <span>View All Cleaning Services</span>
                </span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>

              <!-- Residential & Management -->
              <div class="text-[10px] font-bold text-pink-600 uppercase tracking-widest px-3 mt-2 mb-1">Residential &
                Management</div>
              <a href="/house-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-house text-pink-300 w-5"></i> House Cleaning</a>
              <a href="/deep-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-sparkles text-pink-300 w-5"></i> Deep Cleaning</a>
              <a href="/recurring-maid-service/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-calendar-check text-pink-300 w-5"></i> Recurring Maid Service</a>
              <a href="/move-in-out-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-truck-ramp-box text-pink-300 w-5"></i> Move In/Out</a>
              <a href="/airbnb-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-key text-pink-300 w-5"></i> Airbnb Cleaning</a>
              <a href="/home-watch-services/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-eye text-pink-300 w-5"></i> Home Watch Services</a>
              <a href="/luxury-estate-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-gem text-pink-300 w-5"></i> Luxury Estate Cleaning</a>
              <a href="/property-management-janitorial/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-city text-pink-300 w-5"></i> Property Mgmt Janitorial</a>

              <!-- Commercial & Janitorial -->
              <div class="text-[10px] font-bold text-pink-600 uppercase tracking-widest px-3 mt-4 mb-1">Commercial &
                Janitorial</div>
              <a href="/commercial-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-building text-pink-300 w-5"></i> Commercial Cleaning</a>
              <a href="/office-janitorial-services/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-briefcase text-pink-300 w-5"></i> Office Janitorial</a>
              <a href="/janitorial-cleaning-services/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-soap text-pink-300 w-5"></i> Janitorial Cleaning</a>
              <a href="/medical-dental-facility-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-hospital text-pink-300 w-5"></i> Medical & Dental</a>
              <a href="/industrial-warehouse-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-warehouse text-pink-300 w-5"></i> Industrial & Warehouse</a>
              <a href="/gym-fitness-center-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-dumbbell text-pink-300 w-5"></i> Gym & Fitness Center</a>
              <a href="/school-daycare-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-school text-pink-300 w-5"></i> School & Daycare</a>
              <a href="/church-worship-center-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-church text-pink-300 w-5"></i> Church & Worship</a>

              <!-- Specialized & Maintenance -->
              <div class="text-[10px] font-bold text-pink-600 uppercase tracking-widest px-3 mt-4 mb-1">Specialized &
                Maintenance</div>
              <a href="/post-construction-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-trowel-bricks text-pink-300 w-5"></i> Post-Construction</a>
              <a href="/pressure-washing/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-water text-pink-300 w-5"></i> Pressure Washing</a>
              <a href="/carpet-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-rug text-pink-300 w-5"></i> Carpet Cleaning</a>
              <a href="/window-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-window-maximize text-pink-300 w-5"></i> Window Cleaning</a>
              <a href="/floor-stripping-waxing/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-broom-ball text-pink-300 w-5"></i> Floor Strip & Wax</a>
              <a href="/solar-panel-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-sun text-pink-300 w-5"></i> Solar Panel Cleaning</a>
              <a href="/gutter-cleaning/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-house-flood-water text-pink-300 w-5"></i> Gutter Cleaning</a>
              <a href="/property-maintenance/"
                class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i
                  class="fa-solid fa-wrench text-pink-300 w-5"></i> Property Maintenance</a>
              
              <a href="/services/"
                class="mobile-link flex items-center justify-center p-2.5 mt-2 rounded-xl bg-white hover:bg-pink-50 text-pink-600 font-bold text-xs uppercase tracking-wider border border-pink-200 transition-all">
                <span>Browse All 24 Services</span> <i class="fa-solid fa-arrow-right ml-2 text-[10px]"></i>
              </a>
              `;

  newContent = newContent.replace(
    /<!--\s*Services Dropdown\s*\(Mega Menu\)\s*-->[\s\S]*?(?=<div class="nav-dropdown">\s*<button[^>]*>\s*Locations|<div class="nav-dropdown">\s*<a[^>]*href="\/locations)/gi,
    alignedMegaMenuHtml
  );

  newContent = newContent.replace(
    /<!--\s*Residential & Management\s*-->[\s\S]*?(?=\s*<\/div>\s*<\/div>\s*<\/div>\s*<div[^>]*class="[^"]*accordion-group)/gi,
    alignedMobileServicesHtml
  );

  // Navigation Links - always service-first
  // Only localize service URLs if this is an actual verified Florida city location (NOT a service slug, home, about, or blog)
  const isActualCityLocation = Boolean(
    loc_slug &&
    loc_slug !== 'home' &&
    !serviceSlugs.includes(loc_slug) &&
    pageType === 'service_or_home' &&
    resolveAnyLocation(loc_slug)
  );

  for (const s_slug of serviceSlugs) {
    if (isActualCityLocation) {
      const flatCombo = `${s_slug}-${loc_slug}`;
      newContent = newContent.replace(new RegExp(`href="/(?:[a-z0-9-]+/)+${s_slug}/"`, 'g'), `href="/${flatCombo}/"`);
      newContent = newContent.replace(new RegExp(`href="/${s_slug}/"`, 'g'), `href="/${flatCombo}/"`);
      newContent = newContent.replace(new RegExp(`href="https://(?:www\\.)?sweetmaidcleaning\\.com/(?:[a-z0-9-]+/)*${s_slug}/"`, 'g'), `href="https://www.sweetmaidcleaning.com/${flatCombo}/"`);
    } else {
      newContent = newContent.replace(new RegExp(`href="/(?:[a-z0-9-]+/)+${s_slug}/"`, 'g'), `href="/${s_slug}/"`);
      newContent = newContent.replace(new RegExp(`href="https://(?:www\\.)?sweetmaidcleaning\\.com/(?:[a-z0-9-]+/)*${s_slug}/"`, 'g'), `href="/${s_slug}/"`);
    }
  }
  
  // Header Navigation: About Us, Blog, Gallery ALWAYS point cleanly to sitewide canonical pages
  newContent = newContent.replace(/href="\/[^/]+\/about\/"/g, 'href="/about/"');
  newContent = newContent.replace(/href="\/about\/"/g, 'href="/about/"');
  newContent = newContent.replace(/href="\/[^/]+\/gallery\/"/g, 'href="/gallery/"');
  newContent = newContent.replace(/href="\/gallery\/"/g, 'href="/gallery/"');
  newContent = newContent.replace(/href="\/blog\/"/g, 'href="/blog/"');
  // Normalize legacy and external home domain links to clean relative root
  newContent = newContent.replace(/href="\/home\/"/g, 'href="/"');
  newContent = newContent.replace(/href="https:\/\/www\.sweetmaidcleaning\.com\/"/g, 'href="/"');

  // Header Navigation: Route Home buttons and Header Logo to the location's main page when on a location permalink, or root '/' for sitewide pages
  const isLocationSpecific = Boolean(
    loc_slug &&
    loc_slug !== 'home' &&
    loc_slug !== 'florida' &&
    !serviceSlugs.includes(loc_slug) &&
    (CITY_PAGES[loc_slug] || resolveAnyLocation(loc_slug) || loc_slug === 'bradenton-fl' || loc_slug === 'longboat-key-fl')
  );
  const locationHomeUrl = isLocationSpecific ? `/${loc_slug}/` : '/';

  // 1. Desktop Nav "Home" link
  newContent = newContent.replace(/<a\s+([^>]*?)href="[^"]*"([^>]*?)>\s*Home\s*<\/a>/gi, `<a $1href="${locationHomeUrl}"$2>Home</a>`);

  // 2. Mobile Drawer Nav "Home" link
  newContent = newContent.replace(
    /<a\s+([^>]*?)href="[^"]*"([^>]*?)>((?:(?!<\/a>)[\s\S])*?<span[^>]*>\s*Home\s*<\/span>(?:(?!<\/a>)[\s\S])*?)<\/a>/gi,
    `<a $1href="${locationHomeUrl}"$2>$3</a>`
  );

  // 3. Header Logo Link (Desktop & Mobile header bar)
  newContent = newContent.replace(
    /<a\s+([^>]*?)href="[^"]*"([^>]*?class="[^"]*group[^"]*"[^>]*?)>([\s\S]*?<img[^>]*?>[\s\S]*?)<\/a>/i,
    `<a $1href="${locationHomeUrl}"$2>$3</a>`
  );
  newContent = newContent.replace(
    /<a\s+([^>]*?class="[^"]*group[^"]*"[^>]*?)href="[^"]*"([^>]*?)>([\s\S]*?<img[^>]*?>[\s\S]*?)<\/a>/i,
    `<a $1href="${locationHomeUrl}"$2>$3</a>`
  );

  // Replace Logo with the new uploaded brand logo
  newContent = newContent.replace(/https:\/\/i\.ibb\.co\/PzPDfC1N\/Whats-App-Image-2026-02-09-at-4-52-59-PM-Picsart-Background-Remover\.png/g, '/images/logo.png');

  // Localize top header bar on location pages
  if (loc_slug && loc_slug !== 'home' && clean_name) {
    newContent = newContent.replace(/Professional Cleaning Service in\s+Bradenton/gi, `Professional Cleaning Service in ${clean_name}`);
  }

  const isSpecificService = serviceSlugs.includes(currentService);
  const nearestLocations = getNearestLocations(loc_slug, 12);
  const getNearbyUrl = (citySlug: string) => {
    return (is_sub_page && isSpecificService) ? `/${currentService}-${citySlug}/` : `/${citySlug}/`;
  };

  // 1. Transform Desktop Header "Services" dropdown trigger into an active clickable link to /services/
  newContent = newContent.replace(
    /<button\b([^>]*?)>\s*Services\s*<i class="fa-solid fa-chevron-down[^"]*"><\/i>\s*<\/button>/gi,
    '<a href="/services/" $1 aria-label="Florida Cleaning Services Directory">Services <i class="fa-solid fa-chevron-down text-xs"></i></a>'
  );

  // 2. Transform Desktop Header "Locations" dropdown trigger into an active clickable link to /locations/
  newContent = newContent.replace(
    /<button\b([^>]*?)>\s*Locations\s*<i class="fa-solid fa-chevron-down[^"]*"><\/i>\s*<\/button>/gi,
    '<a href="/locations/" $1 aria-label="Florida Service Locations Directory">Locations <i class="fa-solid fa-chevron-down text-xs"></i></a>'
  );

  // 3. Direct ALL "View All Locations" links cleanly and reliably to /locations/
  newContent = newContent.replace(
    /<a\b(?:(?!<\/a>)[\s\S])*?View All Locations(?:(?!<\/a>)[\s\S])*?<\/a>/gi,
    '<a href="/locations/" class="text-xs font-bold text-pink-500 hover:text-pink-700 uppercase tracking-widest transition flex items-center justify-between py-1 group"><span>View All Locations</span> <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i></a>'
  );

  if (pageType !== 'login') {
    // Dynamically compute and inject the 100% geographically nearest locations
    const desktopNearbyHtml = nearestLocations.map(c => 
      `<a href="${getNearbyUrl(c.slug)}" class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">${c.name}</a>`
    ).join('\n');

    const mobileNearbyHtml = `
      <a href="/locations/" class="mobile-link flex items-center justify-between p-3.5 mb-1.5 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold text-sm shadow-md shadow-pink-200 active:scale-95 transition-all">
        <span class="flex items-center gap-2.5">
          <i class="fa-solid fa-map-location-dot"></i>
          <span>View All Florida Locations</span>
        </span>
        <i class="fa-solid fa-arrow-right text-xs"></i>
      </a>
      ${nearestLocations.map(c => 
        `<a href="${getNearbyUrl(c.slug)}" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-location-dot text-pink-300 w-5"></i><span>${c.name}</span></a>`
      ).join('\n')}
      <a href="/locations/" class="mobile-link flex items-center justify-center p-2.5 mt-1 rounded-xl bg-white hover:bg-pink-50 text-pink-600 font-bold text-xs uppercase tracking-wider border border-pink-200 transition-all">
        <span>Browse All Florida Cities</span> <i class="fa-solid fa-arrow-right ml-2 text-[10px]"></i>
      </a>
    `;

    newContent = newContent.replace(
      /(<div id="nearby-locations-list"[^>]*>)[\s\S]*?(<\/div>\s*<div class="border-t)/i,
      `<div id="nearby-locations-list" class="space-y-1">\n${desktopNearbyHtml}\n</div>\n              <div class="border-t`
    );

    newContent = newContent.replace(
      /(<div id="mobile-nearby-list"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*\n?\s*<a href="[^"]*blog\/)/i,
      `<div id="mobile-nearby-list" class="grid grid-cols-1 gap-2 p-3 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">\n${mobileNearbyHtml}\n</div>\n          </div>\n        </div>\n\n        <a href="/blog/`
    );

    // Also update footer "Locations We Serve" grid with the top 28 closest neighboring locations
    const nearestFooterLocations = getNearestLocations(loc_slug, 28);
    const footerGridHtml = nearestFooterLocations.map(c => 
      `<a href="${getNearbyUrl(c.slug)}" class="hover:text-pink-400 transition-colors">${c.name}</a>`
    ).join('\n');

    newContent = newContent.replace(
      /(<div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">)[\s\S]*?(<\/div>)/i,
      `$1\n${footerGridHtml}\n$2`
    );
  } else {
    // Zero-City Navigation for Login Page: Pure cleaning services keywords only
    const loginDesktopNearbyHtml = `
      <a href="/locations/" class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition flex items-center justify-between"><span>Florida Service Areas</span> <i class="fa-solid fa-arrow-right text-xs"></i></a>
      <a href="/house-cleaning/" class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">House Cleaning Services</a>
      <a href="/deep-cleaning/" class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Deep Cleaning Services</a>
      <a href="/recurring-maid-service/" class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">Recurring Maid Services</a>
    `;
    const loginMobileNearbyHtml = `
      <a href="/locations/" class="mobile-link flex items-center justify-between p-3.5 mb-1.5 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold text-sm shadow-md shadow-pink-200 active:scale-95 transition-all">
        <span class="flex items-center gap-2.5">
          <i class="fa-solid fa-map-location-dot"></i>
          <span>View All Florida Locations</span>
        </span>
        <i class="fa-solid fa-arrow-right text-xs"></i>
      </a>
      <a href="/house-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-broom text-pink-300 w-5"></i><span>House Cleaning</span></a>
      <a href="/deep-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-sparkles text-pink-300 w-5"></i><span>Deep Cleaning</span></a>
      <a href="/recurring-maid-service/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-calendar-check text-pink-300 w-5"></i><span>Recurring Maid Services</span></a>
    `;

    newContent = newContent.replace(
      /(<div id="nearby-locations-list"[^>]*>)[\s\S]*?(<\/div>\s*<div class="border-t)/i,
      `<div id="nearby-locations-list" class="space-y-1">\n${loginDesktopNearbyHtml}\n</div>\n              <div class="border-t`
    );

    newContent = newContent.replace(
      /(<div id="mobile-nearby-list"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*\n?\s*<a href="[^"]*blog\/)/i,
      `<div id="mobile-nearby-list" class="grid grid-cols-1 gap-2 p-3 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">\n${loginMobileNearbyHtml}\n</div>\n          </div>\n        </div>\n\n        <a href="/blog/`
    );
  }

  // Strip native inline onclick to let React ClientInteractions intercept it perfectly
  newContent = newContent.replace(/onclick="this\.parentElement\.classList\.toggle\('accordion-active'\)"/gi, "");

  // Eliminate ONLY the pink button locations grid from the Service Areas section while preserving the Map
  newContent = newContent.replace(/<div class="grid grid-cols-2 md:grid-cols-4 gap-3">[\s\S]*?<\/div>/g, '');

  // Replace Unsplash placeholders with unique ultra-realistic AI images
  newContent = newContent.replace('https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&amp;fit=crop&amp;q=80', '../../../images/carpet-cleaning.jpeg');
  newContent = newContent.replace('https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&amp;fit=crop&amp;q=80', '../../../images/window-cleaning.jpeg');

  // Safely remove redundant search bar section, hero search forms, and city search scripts across all pages
  newContent = newContent.replace(/<!--\s*=+\s*GLOBAL SEARCH BAR SECTION[\s\S]*?<\/section>/gi, '');
  newContent = newContent.replace(/<!--\s*Hero Interactive City Search Bar\s*-->[\s\S]*?<\/form>\s*<\/div>/gi, '');
  newContent = newContent.replace(/<div[^>]*id=["']hero-search-wrapper["'][\s\S]*?<\/form>\s*<\/div>/gi, '');
  newContent = newContent.replace(/<form[^>]*id=["']hero-city-search-form["'][\s\S]*?<\/form>/gi, '');
  newContent = newContent.replace(/<form[^>]*class=["'][^"']*city-search-form[^"']*["'][\s\S]*?<\/form>/gi, '');
  newContent = newContent.replace(/<!--\s*Interactive Search Script for Hero Search Bar\s*-->[\s\S]*?<\/script>/gi, '');
  newContent = newContent.replace(/<script[^>]*src=["'][^"']*city-search\.js["'][^>]*><\/script>/gi, '');
  newContent = newContent.replace(/<!--\s*City Search Script\s*-->\s*<script[^>]*src=["'][^"']*city-search\.js["'][^>]*><\/script>/gi, '');
  newContent = newContent.replace(/<!--\s*Let Us Contact You Form\s*-->[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/gi, '');

  // Re-organize Footer Layout: Clean 5-column layout with Company Info (2 cols), Our Services (2 cols), and Florida Locations (1 col)
  const FOOTER_LOCATIONS_COL = `<div class="lg:col-span-1">
          <h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-pink-300 rounded-full"></span><a href="/locations/" class="hover:text-pink-500 transition-colors" aria-label="Browse all Florida cleaning locations">Florida Locations</a>
          </h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/jacksonville-fl/" class="text-gray-600 hover:text-pink-500 transition-colors">Jacksonville &amp; NE FL</a></li>
            <li><a href="/st-augustine-fl/" class="text-gray-600 hover:text-pink-500 transition-colors">St. Augustine</a></li>
            <li><a href="/orlando-fl/" class="text-gray-600 hover:text-pink-500 transition-colors">Orlando &amp; Central FL</a></li>
            <li><a href="/tampa-fl/" class="text-gray-600 hover:text-pink-500 transition-colors">Tampa &amp; St. Pete</a></li>
            <li><a href="/sarasota-fl/" class="text-gray-600 hover:text-pink-500 transition-colors">Sarasota &amp; Bradenton</a></li>
            <li><a href="/west-palm-beach-fl/" class="text-gray-600 hover:text-pink-500 transition-colors">West Palm Beach</a></li>
            <li><a href="/fort-lauderdale-fl/" class="text-gray-600 hover:text-pink-500 transition-colors">Fort Lauderdale</a></li>
            <li><a href="/miami-fl/" class="text-gray-600 hover:text-pink-500 transition-colors">Miami &amp; South FL</a></li>
            <li class="pt-2">
              <a href="/locations/" class="inline-flex items-center gap-1.5 font-bold text-pink-600 hover:text-pink-700 transition-colors" aria-label="View all 229 Florida cleaning locations">
                <span>View All 229 Cities</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </li>
          </ul>
        </div>`;

  // Replace legacy Locations We Serve block with clean Florida Locations column
  newContent = newContent.replace(
    /<div class="lg:col-span-2">\s*<h4[^>]*>\s*<span[^>]*><\/span>Locations We Serve[\s\S]*?<\/div>\s*<\/div>/i,
    FOOTER_LOCATIONS_COL
  );

  // Link "Our Services" header in footer to /services/
  newContent = newContent.replace(
    /<h4([^>]*>\s*<span[^>]*><\/span>)Our Services\s*<\/h4>/gi,
    '<h4$1<a href="/services/" class="hover:text-pink-500 transition-colors" aria-label="Explore all Sweet Maid cleaning services">Our Services</a></h4>'
  );

  // Expand "Our Services" to take up 2 grid columns with a 2-column list + View All link
  newContent = newContent.replace(
    /<div>(\s*<h4[^>]*>[\s\S]*?<\/h4>\s*<div[^>]*>\s*<ul class=")([^"]+)(")/i,
    '<div class="lg:col-span-2">$1$2 sm:columns-2 gap-x-8$3'
  );

  newContent = newContent.replace(
    /(<a href="\/property-maintenance\/"[^>]*>[\s\S]*?<\/a>\s*<\/li>)/i,
    `$1\n              <li class="pt-2"><a href="/services/" class="font-bold text-pink-600 hover:text-pink-700 transition flex items-center gap-1" aria-label="Explore all 24 professional cleaning services"><span>View All 24 Services</span> <i class="fa-solid fa-arrow-right text-[10px]"></i></a></li>`
  );

  // Upgrade Eco-Friendly block flat icon with the Premium CSS-animated Earth Globe using GPU-accelerated transform
  const GLOBE_HTML = `<style>
        @keyframes earthRotate { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
        @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
      </style>
      <div class="flex items-center justify-center mb-8">
        <div class="relative w-[200px] h-[200px] rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.2),-5px_0_8px_#c3f4ff_inset,15px_2px_25px_#000_inset,-24px_-2px_34px_#c3f4ff99_inset,200px_0_44px_#00000066_inset,100px_0_38px_#000000aa_inset]">
          <div class="absolute inset-0 w-[200%] h-full flex pointer-events-none" style="background-image: url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg'); background-size: 50% 100%; background-repeat: repeat-x; will-change: transform; animation: earthRotate 30s linear infinite;"></div>
          <div class="absolute left-[-20px] w-1 h-1 bg-white rounded-full pointer-events-none" style="animation: twinkling 3s infinite"></div>
          <div class="absolute left-[-40px] top-[30px] w-1 h-1 bg-white rounded-full pointer-events-none" style="animation: twinkling-slow 2s infinite"></div>
          <div class="absolute left-[150px] top-[90px] w-1 h-1 bg-white rounded-full pointer-events-none" style="animation: twinkling-long 4s infinite"></div>
          <div class="absolute left-[100px] top-[180px] w-1 h-1 bg-white rounded-full pointer-events-none" style="animation: twinkling 3s infinite"></div>
          <div class="absolute left-[50px] top-[150px] w-1 h-1 bg-white rounded-full pointer-events-none" style="animation: twinkling-fast 1.5s infinite"></div>
          <div class="absolute left-[180px] top-[20px] w-1 h-1 bg-white rounded-full pointer-events-none" style="animation: twinkling-long 4s infinite"></div>
          <div class="absolute left-[90px] top-[60px] w-1 h-1 bg-white rounded-full pointer-events-none" style="animation: twinkling-slow 2s infinite"></div>
        </div>
      </div>`;
  newContent = newContent.replace(/<i class="fa-solid fa-earth-americas[^>]*><\/i>/gi, GLOBE_HTML);

  // ----------------------------------------------------
  // 100% LIGHTHOUSE OPTIMIZATION ENGINE
  // Accessibility (A11y), Best Practices & Performance
  // ----------------------------------------------------

  // 1. Accessibility: Interactive Buttons & Controls
  newContent = newContent.replace(/<button([^>]*id="mobile-btn"[^>]*)>/gi, '<button aria-label="Open mobile navigation menu"$1>');
  newContent = newContent.replace(/<button([^>]*id="close-mobile"[^>]*)>/gi, '<button aria-label="Close mobile navigation menu"$1>');
  newContent = newContent.replace(/<button([^>]*id="prev-service"[^>]*)>/gi, '<button aria-label="Previous service slide"$1>');
  newContent = newContent.replace(/<button([^>]*id="next-service"[^>]*)>/gi, '<button aria-label="Next service slide"$1>');
  newContent = newContent.replace(/<button([^>]*>\s*Services\s*<i)/gi, '<button aria-label="Services Dropdown Menu"$1');
  newContent = newContent.replace(/<button([^>]*>\s*Locations\s*<i)/gi, '<button aria-label="Locations Dropdown Menu"$1');
  newContent = newContent.replace(/<button([^>]*class="[^"]*accordion[^"]*"[^>]*)>/gi, '<button aria-label="Toggle section details"$1>');
  newContent = newContent.replace(/<button([^>]*class="[^"]*rounded-2xl[^"]*"[^>]*)>/gi, '<button aria-label="Toggle menu section"$1>');
  newContent = newContent.replace(/<button([^>]*class="[^"]*w-2\.5[^"]*"[^>]*)>/gi, '<button aria-label="Service carousel slide"$1>');
  newContent = newContent.replace(/<button([^>]*>\s*<i class="fa-solid fa-xmark)/gi, '<button aria-label="Clear search input"$1');

  // Strip unused runtime scripts & styles to eliminate main-thread blocking
  newContent = newContent.replace(/<script\b[^>]*cdn\.tailwindcss\.com[^>]*><\/script>\s*/gi, '');
  newContent = newContent.replace(/<script\b[^>]*unpkg\.com\/aos[^>]*><\/script>\s*/gi, '');
  newContent = newContent.replace(/<link\b[^>]*unpkg\.com\/aos[^>]*>\s*/gi, '');
  newContent = newContent.replace(/<script\b[^>]*navigation-dynamic\.js[^>]*><\/script>\s*/gi, '');

  // Custom native "Get My Free Quote" form generator with dynamic phone and pre-selected service
  const mapServiceToOption = (serviceSlug: string): string => {
    if (!serviceSlug) return '';
    const s = serviceSlug.toLowerCase();
    if (s.includes('deep')) return 'deep-clean';
    if (s.includes('move')) return 'move-in-out';
    if (s.includes('commercial') || s.includes('office') || s.includes('janitorial') || s.includes('warehouse')) return 'commercial';
    if (s.includes('airbnb') || s.includes('vacation')) return 'airbnb';
    if (s.includes('construction') || s.includes('renovation')) return 'post-construction';
    if (s.includes('recurring') || s.includes('maid')) return 'recurring';
    if (s.includes('house') || s.includes('residential')) return 'residential';
    return '';
  };

  const formPhoneFormatted = is305Area(loc_slug, clean_name) ? '(305) 851-6959' : '(941) 222-2080';
  const formPhoneTel = is305Area(loc_slug, clean_name) ? 'tel:+13058516959' : 'tel:+19412222080';
  const serviceCandidate = (currentService && currentService !== 'cleaning' && currentService !== 'about')
    ? currentService
    : (serviceSlugs.includes(loc_slug) ? loc_slug : pageType);
  const activeServiceOpt = mapServiceToOption(serviceCandidate);
  const isSelected = (val: string) => activeServiceOpt === val ? 'selected' : '';
  const hasSelected = ['residential', 'recurring', 'commercial', 'airbnb', 'deep-clean', 'move-in-out', 'post-construction', 'other'].includes(activeServiceOpt);

  const nativeQuoteFormHtml = `
        <!-- Contact Form -->
        <div class="w-full">
          <form class="quote-card" id="quoteForm">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-serif">Get a Free Quote</h2>
            <p class="text-gray-600 text-sm mb-6 leading-relaxed">Fill out the form below and we'll get back to you within 24 hours with a personalized quote.</p>

            <div class="field">
              <label for="service">What Are You Looking For?</label>
              <select id="service" name="service" required>
                <option value="" disabled ${hasSelected ? '' : 'selected'}>Choose Service</option>
                <option value="residential" ${isSelected('residential')}>Residential Cleaning</option>
                <option value="recurring" ${isSelected('recurring')}>Recurring Cleaning</option>
                <option value="commercial" ${isSelected('commercial')}>Commercial Cleaning</option>
                <option value="airbnb" ${isSelected('airbnb')}>Airbnb / Turnover Cleaning</option>
                <option value="deep-clean" ${isSelected('deep-clean')}>Deep Cleaning</option>
                <option value="move-in-out" ${isSelected('move-in-out')}>Move In / Move Out Cleaning</option>
                <option value="post-construction" ${isSelected('post-construction')}>Post Construction Cleaning</option>
                <option value="other" ${isSelected('other')}>Other</option>
              </select>
            </div>

            <div class="field">
              <label for="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullName" required placeholder="Your full name" autocomplete="name" autocapitalize="words">
            </div>

            <div class="field-row">
              <div class="field">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required placeholder="${formPhoneFormatted}" autocomplete="tel" inputmode="tel">
              </div>
              <div class="field">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required placeholder="name@example.com" autocomplete="email" inputmode="email" autocapitalize="none">
              </div>
            </div>

            <div class="field">
              <label for="address">Address</label>
              <input type="text" id="address" name="address" placeholder="Start typing your address..." autocomplete="street-address">
              <small style="display:block; margin-top:6px; font-size:13px; color:#9aa2ad;">Optional</small>
            </div>

            <button type="submit" class="submit-btn">Get My Free Quote →</button>

            <div class="field consent-field">
              <label class="consent-label">
                <input type="checkbox" id="smsConsent" name="smsConsent" required>
                <span>I consent to receive SMS notifications and alerts from Sweet Maid Cleaning Service.</span>
              </label>
              <div class="consent-links">
                <a href="/terms-and-conditions/" target="_blank" rel="noopener">Terms and Conditions</a>
                <span>·</span>
                <a href="/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a>
              </div>
            </div>

            <div class="trust-row">
              <span>Family-Owned &amp; Operated</span>
              <span>•</span>
              <span>Residential &amp; Commercial Cleaning</span>
            </div>

            <div class="call-line">
              Prefer to talk? Call <a href="${formPhoneTel}">${formPhoneFormatted}</a>
            </div>
          </form>

          <div class="success-card" id="successCard">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13l4 4L19 7" stroke="#1f2937" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2>Thank You for Submitting Your Request</h2>
            <p>We've received your information and a member of our team will reach out shortly to confirm your free quote.</p>
            <div class="call-line">
              Questions in the meantime? Call <a href="${formPhoneTel}">${formPhoneFormatted}</a>
            </div>
          </div>
        </div>`;

  // Replace old iframe-based contact form block with custom native quote form
  newContent = newContent.replace(
    /<div class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">[\s\S]*?<iframe[\s\S]*?<\/iframe>[\s\S]*?(?:<script[\s\S]*?<\/script>)?\s*<\/div>/gi,
    nativeQuoteFormHtml
  );

  // Fallback cleanup if iframe is embedded directly without wrapper
  newContent = newContent.replace(
    /<iframe\s+[^>]*?leadconnectorhq\.com\/widget\/form\/[^>]*>[\s\S]*?<\/iframe>(?:\s*<script\s+src="https:\/\/link\.msgsndr\.com\/js\/form_embed\.js"[^>]*><\/script>)?/gi,
    nativeQuoteFormHtml
  );

  // Strip redundant chat widget script tag to eliminate duplicate /_preview/88yz5isz.js download
  newContent = newContent.replace(/<script\b[^>]*widgets\.leadconnectorhq\.com\/loader\.js[^>]*>[\s\S]*?<\/script>\s*/gi, '');

  // Strip static form_embed.js script tag from templates
  newContent = newContent.replace(
    /<script\s+src="https:\/\/link\.msgsndr\.com\/js\/form_embed\.js"[^>]*><\/script>/gi,
    ''
  );

  // For login page which does not have a local #quote form, route quote links to home page /#quote
  if (pageType === 'login' || loc_slug === 'login') {
    newContent = newContent.replace(/href=["']#quote["']/gi, 'href="/#quote"');
  }

  // Guarantee descriptive destination labels on all carousel links
  const serviceFriendlyNames: Record<string, string> = {
    'deep-cleaning': 'Deep Cleaning',
    'house-cleaning': 'Home Cleaning',
    'move-in-out-cleaning': 'Move-In & Move-Out Cleaning',
    'commercial-cleaning': 'Commercial Cleaning',
    'post-construction-cleaning': 'Post-Construction Cleaning',
    'airbnb-cleaning': 'Airbnb Cleaning',
    'carpet-cleaning': 'Carpet Cleaning',
    'pressure-washing': 'Pressure Washing',
    'window-cleaning': 'Window Cleaning',
    'office-janitorial-services': 'Office Janitorial Services',
    'medical-dental-facility-cleaning': 'Medical Facility Cleaning',
    'luxury-estate-cleaning': 'Luxury Estate Cleaning'
  };

  newContent = newContent.replace(
    /(<a\s+[^>]*href="\/([a-z0-9-]+)\/?"[^>]*>)([\s\S]*?<span[^>]*class="[^"]*group-hover\/btn:translate-x-1[^"]*"[^>]*>)\s*Learn\s*\n?\s*More\s*(<\/span>[\s\S]*?<\/a>)/gi,
    (match, aTag, sSlug, beforeSpan, afterSpan) => {
      const label = serviceFriendlyNames[sSlug] || `${formatName(sSlug)} Cleaning`;
      let newATag = aTag;
      if (!newATag.includes('aria-label=')) {
        newATag = newATag.replace('<a ', `<a aria-label="Learn more about ${label} in ${clean_name}" `);
      }
      return `${newATag}${beforeSpan}Explore ${label}${afterSpan}`;
    }
  );

  // 2. Mobile Call Button on Header Left: Guarantee it calls Sweet Maid directly
  const isSouthFlorida305 = is305Area(loc_slug, clean_name);
  const mobilePhoneHref = isSouthFlorida305 ? 'tel:13058516959' : 'tel:19412222080';
  const mobilePhoneDisplay = isSouthFlorida305 ? '(305) 851-6959' : '(941) 222-2080';

  newContent = newContent.replace(
    /<a\s+[^>]*class=["'][^"']*lg:hidden[^"']*["'][^>]*>(?:(?!<\/a>)[\s\S])*?<i\s+class=["'][^"']*fa-phone[^"']*["'][\s\S]*?<\/a>/gi,
    `<a href="${mobilePhoneHref}" class="lg:hidden w-11 h-11 flex items-center justify-center bg-pink-50 text-pink-400 hover:bg-pink-100 rounded-full border border-pink-100 shadow-sm active:scale-95 transition-all" aria-label="Call Sweet Maid at ${mobilePhoneDisplay}"><i class="fa-solid fa-phone text-[1.1rem]"></i></a>`
  );

  // Accessibility & Social Links Enhancements
  newContent = newContent.replace(/<a\s+href="tel:([^"]+)"(?![^>]*aria-label)([^>]*)>/gi, `<a href="tel:$1" aria-label="Call Sweet Maid at $1"$2>`);
  newContent = newContent.replace(/<a\s+href="([^"]*facebook[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Follow Sweet Maid on Facebook" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*instagram[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Follow Sweet Maid on Instagram" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*tiktok[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Follow Sweet Maid on TikTok" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*youtube[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Subscribe to Sweet Maid on YouTube" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*linkedin[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Connect with Sweet Maid on LinkedIn" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*pinterest[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Follow Sweet Maid on Pinterest" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*(?:x\.com|twitter\.com)[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Follow Sweet Maid on X" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*yelp\.com[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Find Sweet Maid on Yelp" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*wa\.me[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Chat with Sweet Maid on WhatsApp" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="\/locations\/?"[^>]*)>/gi, '<a aria-label="Browse all Florida cleaning locations" $1>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="\/booknow\/?"[^>]*)>/gi, '<a aria-label="Book a professional cleaning service now" $1>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="\/book-online\/?"[^>]*)>/gi, '<a aria-label="Book your cleaning service online" $1>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="\/about\/?"[^>]*)>/gi, '<a aria-label="About Sweet Maid cleaning company" $1>');

  // Dynamic Full Social Links Bar Upgrade for All Templates
  const fullFooterSocialBar = `<div class="flex flex-wrap items-center gap-2.5">
            <a href="https://www.facebook.com/SweetMaidCleaningService/" target="_blank" rel="noopener noreferrer" aria-label="Follow Sweet Maid on Facebook"
              class="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-pink-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:scale-110 transition-all duration-200"><i
                class="fa-brands fa-facebook-f text-base"></i></a>
            <a href="https://www.instagram.com/sweetmaidcleaningservice/" target="_blank" rel="noopener noreferrer" aria-label="Follow Sweet Maid on Instagram"
              class="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-pink-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-[#dc2743] hover:scale-110 transition-all duration-200"><i
                class="fa-brands fa-instagram text-base"></i></a>
            <a href="https://www.tiktok.com/@sweetmaidcleaningservice" target="_blank" rel="noopener noreferrer" aria-label="Follow Sweet Maid on TikTok"
              class="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-pink-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-black hover:border-black hover:scale-110 transition-all duration-200"><i
                class="fa-brands fa-tiktok text-base"></i></a>
            <a href="https://www.youtube.com/@sweetmaidcleaning" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to Sweet Maid on YouTube"
              class="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-pink-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] hover:scale-110 transition-all duration-200"><i
                class="fa-brands fa-youtube text-base"></i></a>
            <a href="https://www.linkedin.com/company/sweet-maid-cleaning-service/" target="_blank" rel="noopener noreferrer" aria-label="Connect with Sweet Maid on LinkedIn"
              class="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-pink-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:scale-110 transition-all duration-200"><i
                class="fa-brands fa-linkedin-in text-base"></i></a>
            <a href="https://www.pinterest.com/sweetmaidcleaning/" target="_blank" rel="noopener noreferrer" aria-label="Follow Sweet Maid on Pinterest"
              class="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-pink-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#E60023] hover:border-[#E60023] hover:scale-110 transition-all duration-200"><i
                class="fa-brands fa-pinterest-p text-base"></i></a>
            <a href="https://x.com/sweetmaidclean" target="_blank" rel="noopener noreferrer" aria-label="Follow Sweet Maid on X"
              class="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-pink-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-black hover:border-black hover:scale-110 transition-all duration-200"><i
                class="fa-brands fa-x-twitter text-base"></i></a>
            <a href="https://www.yelp.com/biz/sweet-maid-cleaning-service-bradenton-3" target="_blank" rel="noopener noreferrer" aria-label="Find Sweet Maid on Yelp"
              class="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-pink-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#d32323] hover:border-[#d32323] hover:scale-110 transition-all duration-200"><i
                class="fa-brands fa-yelp text-base"></i></a>
            <a href="https://wa.me/16452176738" target="_blank" rel="noopener noreferrer" aria-label="Chat with Sweet Maid on WhatsApp"
              class="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-pink-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] hover:scale-110 transition-all duration-200"><i
                class="fa-brands fa-whatsapp text-base"></i></a>
          </div>`;

  newContent = newContent.replace(
    /<div class="flex flex-wrap gap-3">\s*<a href="https:\/\/www\.facebook\.com\/SweetMaidCleaningService\/"[\s\S]*?<\/div>/gi,
    fullFooterSocialBar
  );

  // Gate "Book Online" links & buttons exclusively to Manatee County pages only
  const isGeneralPage = pageType === 'about' || pageType === 'gallery' || pageType === 'login' || pageType === 'blog' || (originalH1Match && (originalH1Match[1].includes('Blog') || originalH1Match[1].includes('Cleaning Tips'))) || serviceSlugs.includes(loc_slug);
  const isManatee = !isGeneralPage && (isManateeCounty(loc_slug, clean_name) || loc_slug === 'bradenton-fl');

  if (isManatee) {
    // Header Navigation: Inject "Book Online" into desktop & mobile navs and Header CTA
    newContent = newContent.replace(
      /<a\s+[^>]*href=["'](?:#quote|#lead-form|#contact|https:\/\/sweetmaidcleaning\.com\/#quote|\/#quote)["'][^>]*>(?:(?!<\/a>)[\s\S])*?(?:Get Free Quote|Get a Free Quote|Request a Quote|Free Estimate|Book Now|Instant Booking)(?:(?!<\/a>)[\s\S])*?<\/a>/gi,
      `<a href="/book-online/" class="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-7 py-3 rounded-full font-bold shadow-xl shadow-pink-300/50 hover:shadow-2xl hover:shadow-pink-400/60 hover:scale-105 transition-all flex items-center gap-2" aria-label="Book your cleaning service online"><i class="fa-solid fa-calendar-check text-white"></i> Book Online</a>`
    );
    newContent = newContent.replace(
      /<a\s+href="#quote"([^>]*)>(?:(?!<\/a>)[\s\S])*?Get Free Quote(?:(?!<\/a>)[\s\S])*?<\/a>/gi,
      `<a href="/book-online/" class="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-7 py-3 rounded-full font-bold shadow-xl shadow-pink-300/50 hover:shadow-2xl hover:shadow-pink-400/60 hover:scale-105 transition-all flex items-center gap-2" aria-label="Book your cleaning service online"><i class="fa-solid fa-calendar-check text-white"></i> Book Online</a>`
    );

    // 1. Desktop Navigation: Inject "Book Online" into desktop nav bar
    newContent = newContent.replace(
      /(<a[^>]*href="\/gallery\/?"[^>]*>Gallery<\/a>)/i,
      `$1\n          <a href="/book-online/" class="text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors" aria-label="Book your cleaning service online">Book Online</a>`
    );

    // 2. Mobile Header Top Bar: Quick "Book Online" button next to mobile hamburger icon
    newContent = newContent.replace(
      /(<button id="mobile-btn"[^>]*>)/i,
      `<a href="/book-online/" class="lg:hidden bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md mr-2 flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap" aria-label="Book your cleaning service online"><i class="fa-solid fa-calendar-check text-[11px]"></i> Book Online</a>\n        $1`
    );

    // 3. Mobile Slide-Out Drawer: Inject "Book Online" navigation item at top of mobile menu
    newContent = newContent.replace(
      /(<nav class="flex flex-col gap-4">)/i,
      `$1\n        <a href="/book-online/" class="menu-item delay-1 flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-200 font-bold transition-all" aria-label="Book your cleaning service online"><span class="font-bold text-white flex items-center gap-2"><i class="fa-solid fa-calendar-check text-white"></i> Book Online</span><i class="fa-solid fa-arrow-right text-white text-sm"></i></a>`
    );

    // 4. Mobile Slide-Out Drawer: Ensure bottom CTA button is "Get Your Free Quote"
    newContent = newContent.replace(
      /<a\s+[^>]*onclick="closeMenu\(\)"[^>]*>[\s\S]*?<\/a>/gi,
      `<a href="#quote" onclick="closeMenu()" class="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white text-center rounded-2xl py-4 font-bold shadow-lg shadow-pink-300/50 hover:shadow-xl transition-all flex items-center justify-center gap-2" aria-label="Get your free cleaning quote"><i class="fa-solid fa-file-invoice-dollar text-white"></i> Get Your Free Quote</a>`
    );
  }
  // 5. Footer Links: Add full canonical navigation links to footer row
  newContent = newContent.replace(
    /(<footer[\s\S]*?)(<a\s+[^>]*href="\/sitemap\.xml"[^>]*>Sitemap<\/a>)/i,
    `$1<a href="/" class="hover:text-pink-400 transition-colors" aria-label="Sweet Maid Homepage">Home</a>\n          <a href="/about/" class="hover:text-pink-400 transition-colors" aria-label="About Sweet Maid">About Us</a>\n          <a href="/services/" class="hover:text-pink-400 font-semibold transition-colors" aria-label="All Sweet Maid Cleaning Services">Services</a>\n          <a href="/locations/" class="hover:text-pink-400 font-semibold transition-colors" aria-label="All Florida Cleaning Locations">Locations</a>\n          <a href="/book-online/" class="hover:text-pink-400 transition-colors" aria-label="Book Cleaning Online">Book Online</a>\n          <a href="/blog/" class="hover:text-pink-400 transition-colors" aria-label="Cleaning Guides Blog">Blog</a>\n          <a href="/gallery/" class="hover:text-pink-400 transition-colors" aria-label="Before and After Cleaning Gallery">Gallery</a>\n          <a href="/privacy-policy/" class="hover:text-pink-400 transition-colors" aria-label="Read Sweet Maid Privacy Policy">Privacy Policy</a>\n          <a href="/terms-and-conditions/" class="hover:text-pink-400 transition-colors" aria-label="Read Sweet Maid Terms and Conditions">Terms & Conditions</a>\n          $2`
  );

  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="\/services\/?"[^>]*)>/gi, '<a aria-label="Browse Florida Cleaning Services Directory" $1>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="\/locations\/?"[^>]*)>/gi, '<a aria-label="Browse Florida Cleaning Service Locations Directory" $1>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="\/blog\/?"[^>]*)>/gi, '<a aria-label="Read cleaning tips on Sweet Maid blog" $1>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="\/gallery\/?"[^>]*)>/gi, '<a aria-label="View Sweet Maid before and after cleaning gallery" $1>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="\/login\/?"[^>]*)>/gi, '<a aria-label="Customer portal login" $1>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*href="#"[^>]*)>/gi, '<a aria-label="Sweet Maid Cleaning Service Details" $1>');
  newContent = newContent.replace(/<a\s+(?![^>]*aria-label)([^>]*)>/gi, '<a aria-label="Sweet Maid Cleaning Services Florida" $1>');

  // 3. Accessibility: Form Inputs & Controls
  newContent = newContent.replace(/<input\s+type="text"([^>]*placeholder="([^"]+)"(?![^>]*aria-label)[^>]*)>/gi, '<input type="text" aria-label="$2"$1>');
  newContent = newContent.replace(/<input\s+type="email"([^>]*placeholder="([^"]+)"(?![^>]*aria-label)[^>]*)>/gi, '<input type="email" aria-label="$2"$1>');
  newContent = newContent.replace(/<input\s+type="tel"([^>]*placeholder="([^"]+)"(?![^>]*aria-label)[^>]*)>/gi, '<input type="tel" aria-label="$2"$1>');
  newContent = newContent.replace(/<input(?![^>]*aria-label)([^>]*name="([^"]+)"[^>]*)>/gi, '<input aria-label="$2"$1>');
  newContent = newContent.replace(/<input(?![^>]*aria-label)([^>]*type="([^"]+)"[^>]*)>/gi, '<input aria-label="$2 input field"$1>');
  newContent = newContent.replace(/<select(?![^>]*aria-label)([^>]*)>/gi, '<select aria-label="Select Cleaning Service"$1>');
  newContent = newContent.replace(/<textarea(?![^>]*aria-label)([^>]*)>/gi, '<textarea aria-label="Cleaning instructions or message"$1>');

  // 4. Accessibility: Iframes (Google Maps & Widgets)
  newContent = newContent.replace(/<iframe(?![^>]*title)([^>]*)>/gi, `<iframe title="Sweet Maid Service Map in ${clean_name}, Florida"$1>`);

  // 5. Best Practices: Security rel="noopener noreferrer" for all target="_blank"
  newContent = newContent.replace(/<a\s+([^>]*target="_blank"(?![^>]*rel=)[^>]*)>/gi, '<a $1 rel="noopener noreferrer">');

  // 8. Image Paths, Dimensions & WebP Next-Gen Format Upgrade
  newContent = newContent.replace(/src=["'](?:\.\.\/)+images\//gi, 'src="/images/');
  newContent = newContent.replace(/src=["']images\//gi, 'src="/images/');
  newContent = newContent.replace(/url\(['"]?(?:\.\.\/)+images\//gi, "url('/images/");
  newContent = newContent.replace(/url\(['"]?images\//gi, "url('/images/");
  newContent = newContent.replace(/\/images\/([^"')]+)\.jpeg/gi, '/images/$1.webp');

  // Strip redundant client-side Tailwind script from templates (Next.js compiles Tailwind natively)
  newContent = newContent.replace(/<script[^>]*cdn\.tailwindcss\.com[^>]*><\/script>/gi, '');

  // 9. Accessibility: Sequential Heading Hierarchy (H1 -> H2 -> H3 -> H4)
  newContent = newContent.replace(/<h3 class="text-2xl font-bold text-center text-gray-800 mb-6 drop-shadow-sm">Find Services In Your City<\/h3>/gi, '<h2 class="text-2xl font-bold text-center text-gray-800 mb-6 drop-shadow-sm">Find Services In Your City</h2>');
  newContent = newContent.replace(/<h4 class="font-bold text-lg mb-1">([\s\S]*?)<\/h4>/gi, '<h3 class="font-bold text-lg mb-1">$1</h3>');
  newContent = newContent.replace(/<h4 class="text-3xl font-bold mb-4 text-gray-900">100% Eco-Friendly Options<\/h4>/gi, '<h3 class="text-3xl font-bold mb-4 text-gray-900">100% Eco-Friendly Options</h3>');
  newContent = newContent.replace(/<h4 class="font-bold text-gray-900">([^<]+)<\/h4>/gi, '<h3 class="font-bold text-gray-900">$1</h3>');
  newContent = newContent.replace(/<h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">([\s\S]*?)<\/h4>/gi, '<h3 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">$1</h3>');

  // Fix Map Headings and Pin Labels
  newContent = newContent.replace(/<h2 class="text-4xl font-bold mt-3 mb-6">Proudly Serving.*?<\/h2>/gi, `<h2 class="text-4xl font-bold mt-3 mb-6">Proudly Serving ${clean_name}</h2>`);

  // Localized Map Engine: High-reliability OpenStreetMap embed + Google Maps Direction/Place Action
  if (pageType !== 'login') {
    const isDade = isMiamiDadeCounty(loc_slug, clean_name);
    const mapUrl = generateLocalMapUrl(loc_slug, clean_name, isManatee);
    const gmapsLink = getGoogleMapsUrl(loc_slug, clean_name, isManatee, isDade);

    const mapOverlayHtml = isDade
      ? `<div id="local-map-badge" class="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-pink-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 text-sm">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-900">Sweet Maid Cleaning Service • Miami-Dade</div>
              <div class="text-[11px] text-gray-600">Official Google Business Profile • Serving ${clean_name}, FL</div>
            </div>
          </div>
          <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0">
            <span>View Google Business Profile</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>`
      : (loc_slug === 'home' || clean_name.toLowerCase() === 'florida')
      ? `<div id="local-map-badge" class="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-pink-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 text-sm">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-900">Active Service Area: Florida Statewide</div>
              <div class="text-[11px] text-gray-600">Serving homeowners &amp; businesses across Florida</div>
            </div>
          </div>
          <a href="/locations/" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0">
            <span>Explore All 200+ Locations</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>`
      : `<div id="local-map-badge" class="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-pink-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 text-sm">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-900">Active Service Area: ${clean_name}, FL</div>
              <div class="text-[11px] text-gray-600">Serving ${clean_name} &amp; nearby Florida communities</div>
            </div>
          </div>
          <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0">
            <span>Open in Google Maps</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>`;

    newContent = newContent.replace(/src="https:\/\/(?:(?:maps|www)\.google\.com\/maps(?:\/embed)?|www\.openstreetmap\.org\/export\/embed\.html)[^"]*"/gi, `src="${mapUrl}"`);
    newContent = newContent.replace(/<a\s+[^>]*query_place_id=ChIJXVApokD-1woRwX50Oy2OwHA[^>]*>[\s\S]*?<\/a>/gi, mapOverlayHtml);
    newContent = newContent.replace(/<div\s+class="absolute bottom-4 left-4 bg-white\/90[^>]*>[\s\S]*?<\/div>/gi, mapOverlayHtml);
    newContent = newContent.replace(/<div\s+id="local-map-badge"[^>]*>[\s\S]*?<\/div>/gi, mapOverlayHtml);
    newContent = newContent.replace(/Servicing Florida and surrounding areas/gi, `Servicing ${clean_name} and surrounding areas`);
    newContent = newContent.replace(/Servicing entire 34205, 34209, 34208, 34210 areas/g, `Servicing ${clean_name} and surrounding areas`);
  }

  // Strip raw unlocalized static HYPER-LOCAL SEO BLOCK from source templates
  newContent = newContent.replace(/<!--\s*HYPER-LOCAL SEO BLOCK\s*-->[\s\S]*?<!--\s*END HYPER-LOCAL SEO BLOCK\s*-->/gi, '');

  const serviceDisplayName = (pageType === 'about' || currentService === 'about')
    ? 'House Cleaning & Maid Service'
    : (currentService === 'gallery' ? 'Cleaning Services' : formatName(currentService.replace(/-/g, ' ')));
  const targetServiceSlug = isSpecificService ? currentService : 'house-cleaning';

  // Smart URL mapper for daily search keywords to create rich internal links (service-first)
  const getKeywordTargetUrl = (kw: string) => {
    const k = kw.toLowerCase();
    const cityPart = (loc_slug === 'home' || !loc_slug) ? 'bradenton-fl' : loc_slug;
    if (k.includes('deep')) return `/${cityPart ? `deep-cleaning-${cityPart}` : 'deep-cleaning'}/`;
    if (k.includes('move')) return `/${cityPart ? `move-in-out-cleaning-${cityPart}` : 'move-in-out-cleaning'}/`;
    if (k.includes('airbnb') || k.includes('vacation')) return `/${cityPart ? `airbnb-cleaning-${cityPart}` : 'airbnb-cleaning'}/`;
    if (k.includes('commercial') || k.includes('janitorial') || k.includes('office')) return `/${cityPart ? `commercial-cleaning-${cityPart}` : 'commercial-cleaning'}/`;
    if (k.includes('construction') || k.includes('renovation')) return `/${cityPart ? `post-construction-cleaning-${cityPart}` : 'post-construction-cleaning'}/`;
    if (k.includes('carpet') || k.includes('rug')) return `/${cityPart ? `carpet-cleaning-${cityPart}` : 'carpet-cleaning'}/`;
    if (k.includes('pressure') || k.includes('wash')) return `/${cityPart ? `pressure-washing-${cityPart}` : 'pressure-washing'}/`;
    if (k.includes('window')) return `/${cityPart ? `window-cleaning-${cityPart}` : 'window-cleaning'}/`;
    return `/${cityPart ? `house-cleaning-${cityPart}` : 'house-cleaning'}/`;
  };

  // Determine local regional authorities
  const isMonroe = isMonroeCounty(loc_slug, clean_name) && !serviceSlugs.includes(loc_slug);
  const is305 = is305Area(loc_slug, clean_name);
  const localPhoneDisplay = is305 ? '(305) 851-6959' : '(941) 222-2080';
  const localPhoneHref = is305 ? 'tel:13058516959' : 'tel:9412222080';

  const getNearbyTargetUrl = (targetSlug: string) => {
    return (is_sub_page && isSpecificService) ? `/${currentService}-${targetSlug}/` : `/${targetSlug}/`;
  };

  const isFloridaHome = loc_slug === 'home' || clean_name.toLowerCase() === 'florida';

  const floridaKeyCities = [
    { name: 'Miami', slug: 'miami-fl' },
    { name: 'Tampa', slug: 'tampa-fl' },
    { name: 'Orlando', slug: 'orlando-fl' },
    { name: 'Fort Lauderdale', slug: 'fort-lauderdale-fl' },
    { name: 'Bradenton', slug: 'bradenton-fl' },
    { name: 'Sarasota', slug: 'sarasota-fl' },
    { name: 'Jacksonville', slug: 'jacksonville-fl' },
    { name: 'St. Petersburg', slug: 'st-petersburg-fl' },
    { name: 'West Palm Beach', slug: 'west-palm-beach-fl' },
    { name: 'Boca Raton', slug: 'boca-raton-fl' },
    { name: 'Clearwater', slug: 'clearwater-fl' },
    { name: 'St. Augustine', slug: 'st-augustine-fl' }
  ];

  // Internal Location Linking for Manatee County, Florida Keys / Monroe County, or Regional nearest locations
  const internalLocationLinksHtml = isFloridaHome
    ? floridaKeyCities.map(c => `<a href="${getNearbyTargetUrl(c.slug)}" class="px-3.5 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2 group" aria-label="Sweet Maid Cleaning Services in ${c.name}, FL"><i class="fa-solid fa-chevron-right text-[10px] text-pink-300 group-hover:translate-x-0.5 transition-transform"></i><span>${c.name}</span></a>`).join('\n')
    : (isManatee && loc_slug !== 'home')
    ? manateeKeyHubs.map(hub => {
        const isCurrent = hub.slug === loc_slug;
        if (isCurrent) {
          return `<span class="px-3.5 py-2 rounded-xl bg-pink-100 text-pink-800 font-bold flex items-center gap-2 shadow-2xs"><i class="fa-solid fa-location-dot text-xs text-pink-600"></i><span>${hub.name}</span></span>`;
        }
        return `<a href="${getNearbyTargetUrl(hub.slug)}" class="px-3.5 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2 group" aria-label="Sweet Maid Cleaning Services in ${hub.name}, FL"><i class="fa-solid fa-chevron-right text-[10px] text-pink-300 group-hover:translate-x-0.5 transition-transform"></i><span>${hub.name}</span></a>`;
      }).join('\n')
    : isMonroe
    ? monroeKeyHubs.map(hub => {
        const isCurrent = hub.slug === loc_slug;
        if (isCurrent) {
          return `<span class="px-3.5 py-2 rounded-xl bg-pink-100 text-pink-800 font-bold flex items-center gap-2 shadow-2xs"><i class="fa-solid fa-location-dot text-xs text-pink-600"></i><span>${hub.name}</span></span>`;
        }
        return `<a href="${getNearbyTargetUrl(hub.slug)}" class="px-3.5 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2 group" aria-label="Sweet Maid Cleaning Services in ${hub.name}, FL"><i class="fa-solid fa-chevron-right text-[10px] text-pink-300 group-hover:translate-x-0.5 transition-transform"></i><span>${hub.name}</span></a>`;
      }).join('\n')
    : nearestLocations.map(c => {
        return `<a href="${getNearbyTargetUrl(c.slug)}" class="px-3.5 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2 group" aria-label="Sweet Maid Cleaning Services in ${c.name}, FL"><i class="fa-solid fa-chevron-right text-[10px] text-pink-300 group-hover:translate-x-0.5 transition-transform"></i><span>${c.name}</span></a>`;
      }).join('\n');

  // Clean Breadcrumbs and Internal Linking Hub
  const parentRegion = getRegionForCity(loc_slug);
  const siblingCities = isFloridaHome ? floridaKeyCities.slice(0, 8) : getSiblingCities(loc_slug, 8);

  const breadcrumbsHtml = isFloridaHome
    ? `<nav class="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap" aria-label="Breadcrumb">
        <a href="/" class="hover:text-pink-600 transition">Home</a>
        <span class="text-gray-300">/</span>
        <span class="text-gray-800 font-medium">Florida</span>
      </nav>`
    : `
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap" aria-label="Breadcrumb">
      <a href="/" class="hover:text-pink-600 transition">Home</a>
      ${parentRegion && parentRegion.slug ? `<span class="text-gray-300">/</span><a href="/${parentRegion.slug}/" class="hover:text-pink-600 transition">${parentRegion.name}</a>` : ''}
      <span class="text-gray-300">/</span>
      ${isSpecificService ? `<a href="/${loc_slug}/" class="hover:text-pink-600 transition">${clean_name}</a><span class="text-gray-300">/</span><span class="text-gray-800 font-medium">${serviceDisplayName}</span>` : `<span class="text-gray-800 font-medium">${clean_name}</span>`}
    </nav>
  `;

  const siblingLinksHtml = siblingCities.map(c => {
    const isCurrent = c.slug === loc_slug;
    const url = (is_sub_page && isSpecificService) ? `/${currentService}-${c.slug}/` : `/${c.slug}/`;
    if (isCurrent) {
      return `<span class="px-3.5 py-2 rounded-xl bg-pink-100 text-pink-800 font-bold flex items-center gap-2 shadow-2xs"><i class="fa-solid fa-location-dot text-xs text-pink-600"></i><span>${c.name}</span></span>`;
    }
    return `<a href="${url}" class="px-3.5 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2 group" aria-label="Sweet Maid Cleaning Services in ${c.name}, FL"><i class="fa-solid fa-chevron-right text-[10px] text-pink-300 group-hover:translate-x-0.5 transition-transform"></i><span>${c.name}</span></a>`;
  }).join('\n');

  // Internal Core Services Linking for the current location
  const coreServicesList = [
    { name: `House Cleaning`, slug: 'house-cleaning', icon: 'fa-house' },
    { name: `Deep Cleaning`, slug: 'deep-cleaning', icon: 'fa-soap' },
    { name: `Recurring Maid Service`, slug: 'recurring-maid-service', icon: 'fa-calendar-check' },
    { name: `Move-In & Move-Out Cleaning`, slug: 'move-in-out-cleaning', icon: 'fa-boxes-packing' },
    { name: `Airbnb Cleaning`, slug: 'airbnb-cleaning', icon: 'fa-key' },
    { name: `Post-Construction Cleaning`, slug: 'post-construction-cleaning', icon: 'fa-hammer' },
    { name: `Commercial Cleaning`, slug: 'commercial-cleaning', icon: 'fa-building' },
    { name: `Carpet Cleaning`, slug: 'carpet-cleaning', icon: 'fa-rug' },
    { name: `Window Cleaning`, slug: 'window-cleaning', icon: 'fa-table-cells-large' },
    { name: `Janitorial Cleaning`, slug: 'janitorial-cleaning-services', icon: 'fa-broom' },
  ];

  const localServicesLinksHtml = coreServicesList.map(srv => {
    const isCurrent = srv.slug === currentService;
    const url = (loc_slug && loc_slug !== 'home' && !serviceSlugs.includes(loc_slug)) ? `/${srv.slug}-${loc_slug}/` : `/${srv.slug}/`;
    if (isCurrent) {
      return `<span class="px-3.5 py-2.5 rounded-xl bg-pink-100 text-pink-800 font-bold flex items-center gap-2.5 shadow-2xs"><i class="fa-solid ${srv.icon} text-xs text-pink-600"></i><span>${srv.name}</span></span>`;
    }
    return `<a href="${url}" class="px-3.5 py-2.5 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2.5 group"><i class="fa-solid ${srv.icon} text-xs text-pink-400 group-hover:scale-110 transition-transform"></i><span>${srv.name}</span></a>`;
  }).join('\n');

  // Compliant Local Cleaning Authority & Internal Linking Hub
  const seoSection = `
  <section class="py-16 bg-white border-t border-pink-100/70">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      ${breadcrumbsHtml}

      <!-- Local Service Detail Block -->
      <div class="max-w-4xl mx-auto text-center mb-14">
        <div class="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
          <i class="fa-solid fa-sparkles"></i>
          <span>${isFloridaHome ? 'Florida Cleaning Services' : `${clean_name} Cleaning Services`}</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">${isFloridaHome ? 'Professional Cleaning Services Across Florida' : `${serviceDisplayName} in ${clean_name}, FL`}</h2>
        <p class="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
          Sweet Maid Cleaning Service provides reliable residential and commercial cleaning throughout <strong>${isFloridaHome ? 'Florida' : `${clean_name}, Florida`}</strong>. As a family-owned cleaning company, our teams focus on dependable scheduling, thorough detail work, and tailored cleaning plans for every home and business property${isFloridaHome ? ' across the state' : ''}.
        </p>
        <p class="text-gray-600 leading-relaxed text-sm md:text-base mb-6">
          Whether you need recurring housekeeping, a deep seasonal refresh, move-in sanitizing, or professional commercial care in ${isFloridaHome ? 'Florida' : clean_name}, our experienced cleaning teams are ready to help.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="#quote" class="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 text-sm md:text-base">
            <i class="fa-solid fa-calendar-check"></i>
            <span>${isFloridaHome ? 'Request a Free Quote in Florida' : `Request a Quote in ${clean_name}`}</span>
          </a>
          <a href="${localPhoneHref}" class="inline-flex items-center gap-2 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 font-bold px-6 py-3 rounded-full shadow-xs transition-all hover:scale-105 text-sm md:text-base">
            <i class="fa-solid fa-phone text-pink-500"></i>
            <span>${localPhoneDisplay}</span>
          </a>
        </div>
      </div>

      <!-- Regional & Service Internal Linking Hub -->
      <div class="pt-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Sibling Cities in Region Linking -->
          <div class="bg-white p-6 md:p-8 rounded-2xl border border-pink-100 shadow-xs">
            <div class="flex items-center gap-3 mb-5 pb-3 border-b border-pink-50">
              <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg">
                <i class="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg">${isFloridaHome ? 'Popular Service Areas Across Florida' : (parentRegion ? parentRegion.name : 'Nearby Service Areas')}</h3>
                <p class="text-xs text-gray-500">${isFloridaHome ? 'Major cities served throughout Florida' : 'Service locations in this area'}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-2 gap-2 text-sm">
              ${siblingLinksHtml}
            </div>
          </div>

          <!-- Core Services Linking -->
          <div class="bg-white p-6 md:p-8 rounded-2xl border border-pink-100 shadow-xs">
            <div class="flex items-center gap-3 mb-5 pb-3 border-b border-pink-50">
              <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg">
                <i class="fa-solid fa-broom"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg">Cleaning Services in ${isFloridaHome ? 'Florida' : clean_name}</h3>
                <p class="text-xs text-gray-500">Professional residential & commercial care</p>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              ${localServicesLinksHtml}
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
  `;

  // Eradicate any lateral cross-links bar
  newContent = newContent.replace(/<!--\s*LATERAL SEO CROSS-LINKS\s*-->[\s\S]*?<!--\s*END LATERAL SEO CROSS-LINKS\s*-->/gi, '');
  newContent = newContent.replace(/<section[^>]*aria-label="Explore Nearby Cleaning Service Areas"[\s\S]*?<\/section>/gi, '');
  newContent = newContent.replace(/<div[^>]*class="[^"]*bg-gray-50[^"]*"[^>]*>[\s\S]*?Explore Nearby Cleaning Service Areas[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '');

  if (pageType === 'blog') {
    newContent = newContent.replace(/<!--\s*AREAS\s*&\s*MAP\s*-->[\s\S]*?<\/section>/gi, '');
    newContent = newContent.replace(/<section[^>]*id="areas"[\s\S]*?<\/section>/gi, '');
    newContent = newContent.replace(/<!--\s*FAQ\s*-->[\s\S]*?<\/section>/gi, '');
    newContent = newContent.replace(/<section[^>]*Frequently Asked Questions[\s\S]*?<\/section>/gi, '');
  }

  if (pageType !== 'login' && pageType !== 'blog' && newContent.includes('<footer')) {
    newContent = newContent.replace(/<footer/i, seoSection + '\n<footer');
  }


  // Dynamic SEO-Maximized FAQs tailored specifically to the Service and Location
  const dynamicFaqHtml = `<div class="space-y-4">
    ${seoPack.faqs.map(faq => `
      <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
        <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
          ${faq.q}
          <span class="transition duration-300 group-open:-rotate-180">
            <i class="fa-solid fa-chevron-down text-pink-300"></i>
          </span>
        </summary>
        <p class="mt-4 text-gray-600 leading-relaxed">
          ${faq.a}
        </p>
      </details>
    `).join('\n')}
  </div>`;

  const pilot = loc_slug ? PILOT_LOCATIONS_DATA[loc_slug] : undefined;
  const pilotNeighborhoodsHtml = (pilot && pilot.neighborhoodsList?.length) ? `
      <div class="mt-12 pt-10 border-t border-pink-100/80">
        <div class="max-w-3xl mb-6">
          <div class="inline-flex items-center gap-2 bg-pink-100/80 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <span>📍 Local Service Area</span>
          </div>
          <h4 class="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-2">${pilot.neighborhoodsTitle}</h4>
          <p class="text-gray-600 text-sm md:text-base leading-relaxed">${pilot.neighborhoodsBody}</p>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">
          ${pilot.neighborhoodsList.map(n => `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-700 border border-pink-100 shadow-xs">
              <i class="fa-solid fa-location-dot text-pink-400 text-[10px]"></i>
              ${n}
            </span>
          `).join('')}
        </div>
        <div class="text-xs text-gray-500">
          <span class="font-semibold text-gray-600">Primary Zip Codes Served:</span> ${pilot.zipCodes.join(', ')}
        </div>
      </div>
  ` : '';

  const climateSectionHtml = `
  <section class="py-14 bg-gradient-to-b from-pink-50/60 to-white border-y border-pink-100/60">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="max-w-3xl mb-8">
        <div class="inline-flex items-center gap-2 bg-pink-100/80 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          <span>🌴 Local Climate & Property Protection</span>
        </div>
        <h3 class="text-2xl md:text-3xl font-bold text-gray-900 font-serif mb-4">${seoPack.climateTitle}</h3>
        <p class="text-gray-700 leading-relaxed text-base md:text-lg">${seoPack.climateBody}</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        ${seoPack.whyChoosePoints.map(p => `
          <div class="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition">
            <div class="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center mb-4 text-lg">
              <i class="fa-solid ${p.icon}"></i>
            </div>
            <h4 class="font-bold text-gray-900 mb-2">${p.title}</h4>
            <p class="text-sm text-gray-600 leading-relaxed">${p.desc}</p>
          </div>
        `).join('\n')}
      </div>
      ${pilotNeighborhoodsHtml}
    </div>
  </section>
  `;

  // Inject Climate Section above Footer
  if (pageType !== 'login' && pageType !== 'blog' && newContent.includes('<footer')) {
    newContent = newContent.replace(/<footer/i, climateSectionHtml + '\n<footer');
  }

  // Inject Structured JSON-LD Schema
  if (pageType === 'about') {
    const aboutSchema = [
      {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "CleaningService", "Organization"],
        "name": `Sweet Maid Cleaning Service`,
        "description": `Family-owned cleaning company serving Florida communities. Providing professional house cleaning, recurring maid services, and commercial sanitizing.`,
        "url": `https://www.sweetmaidcleaning.com/about/`,
        "telephone": is305Area(loc_slug, clean_name) ? "(305) 851-6959" : "(941) 222-2080",
        "image": "https://www.sweetmaidcleaning.com/images/logo.png",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Bradenton, FL",
          "addressLocality": "Bradenton",
          "addressRegion": "FL",
          "addressCountry": "US"
        },
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Florida"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sweetmaidcleaning.com/" },
          { "@type": "ListItem", "position": 2, "name": "About Us", "item": `https://www.sweetmaidcleaning.com/about/` }
        ]
      }
    ];
    // Strip any raw legacy schemas from templates before injecting verified schema
    newContent = newContent.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
    newContent += `\n<script type="application/ld+json">${JSON.stringify(aboutSchema)}</script>`;
  } else if (pageType !== 'login' && loc_slug !== 'home') {
    // Strip any raw legacy schemas from templates before injecting verified schema
    newContent = newContent.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
    newContent += `\n<script type="application/ld+json">${seoPack.schemaJson}</script>`;
  } else if (loc_slug === 'home') {
    // Strip legacy schemas on homepage; page.tsx injects official structured data
    newContent = newContent.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
  } else {
    const loginSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Customer Portal & Account Login | Sweet Maid Cleaning Services",
      "description": "Log in to your Sweet Maid Cleaning customer portal. Easily schedule recurring maid services, book deep home cleanings, manage appointments, and view invoices.",
      "url": "https://www.sweetmaidcleaning.com/login/",
      "provider": {
        "@type": "CleaningService",
        "name": "Sweet Maid Cleaning Service",
        "url": "https://www.sweetmaidcleaning.com/",
        "telephone": "+1-941-222-2080",
        "email": "info@sweetmaidcleaning.com",
        "sameAs": [
          "https://www.facebook.com/SweetMaidCleaningService/",
          "https://www.instagram.com/sweetmaidcleaningservice/",
          "https://www.tiktok.com/@sweetmaidcleaningservice",
          "https://www.youtube.com/@sweetmaidcleaning",
          "https://www.linkedin.com/company/sweet-maid-cleaning-service/",
          "https://www.pinterest.com/sweetmaidcleaning/",
          "https://x.com/sweetmaidclean",
          "https://www.yelp.com/biz/sweet-maid-cleaning-service-bradenton-3"
        ]
      }
    };
    // Strip any raw legacy schemas from templates before injecting verified schema
    newContent = newContent.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
    newContent += `\n<script type="application/ld+json">${JSON.stringify(loginSchema)}</script>`;
  }

  // Swap out the static generic FAQ accordion block with the SEO-maximized dynamic block
  const staticFaqBlockRegex = /<div class="space-y-4">\s*<!-- Q1 -->[\s\S]*?protect you and your home\.\s*<\/p>\s*<\/details>\s*<\/div>/i;
  newContent = newContent.replace(staticFaqBlockRegex, dynamicFaqHtml);
  const isManateeCountyPage = isManateeCounty(loc_slug, clean_name) || loc_slug === 'bradenton-fl' || loc_slug === 'home';
  const showLiveElfsight = isManateeCountyPage;

  // Swap out the static reviews carousel: use live Elfsight Google Business Profile widget for Manatee County, or hyper-local SEO reviews for all other pages
  const reviewsCarouselRegex = /<!-- Reviews Carousel -->[\s\S]*?(?=<!-- Trustindex Badge -->|<!-- Trustindex & Google Reviews Action Links -->)/gi;
  const bradentonElfsightHtml = `<!-- Reviews Carousel -->
      <div class="mt-16">
        <!-- Elfsight Google Reviews | Untitled Google Reviews -->
        <script src="https://elfsightcdn.com/platform.js" async></script>
        <div class="elfsight-app-155f35e3-448d-4bc2-b8c4-fc9011f6424c" data-elfsight-app-lazy></div>
      </div>
      
      `;
  const localSeoReviewsHtml = generateLocalSeoReviewsHtml(clean_name, loc_slug, currentService, isSpecificService);
  const fullReviewsCarouselHtml = showLiveElfsight ? bradentonElfsightHtml : localSeoReviewsHtml;
  newContent = newContent.replace(reviewsCarouselRegex, fullReviewsCarouselHtml);

  // Localize reviews section subtitle above carousel so it addresses this specific Florida city
  newContent = newContent.replace(
    /<p class="text-lg text-gray-600 max-w-3xl mx-auto">\s*If you're looking for a reliable and affordable[\s\S]*?Sweet Maid Cleaning Service is your best choice\.\s*<\/p>/i,
    `<p class="text-lg text-gray-600 max-w-3xl mx-auto">
      See what satisfied homeowners and business clients across <span class="font-bold text-gray-900">${clean_name === 'Florida' ? 'Florida' : `${clean_name}, FL`}</span> are saying about Sweet Maid's cleaning services.
    </p>`
  );
  newContent = newContent.replace(/House Cleaning Service\s+Florida/gi, `${serviceDisplayName} in ${clean_name}`);

  // Swap out the Trustindex Badge block with real-time links to Google Business Profile reviews (or empty for Bradenton Elfsight widget)
  const trustIndexRegex = /<!-- Trustindex Badge -->\s*<div[^>]*>\s*<div[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi;
  const realTimeReviewsHtml = showLiveElfsight ? `<!-- Elfsight Google Reviews Widget Loaded -->` : `<!-- Trustindex & Google Reviews Action Links -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 border-t border-pink-100/50 pt-8">
        <div
          class="inline-flex items-center gap-2 bg-pink-50 text-pink-600 border border-pink-100 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
          <i class="fa-solid fa-shield-halved"></i>
          Verified Customer Reviews in ${clean_name === 'Florida' ? 'Florida' : `${clean_name}, FL`}
        </div>
        <div class="flex flex-wrap gap-3 justify-center">
          <a href="https://search.google.com/local/reviews?placeid=ChIJXVApokD-1woRwX50Oy2OwHA" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition hover:scale-[1.02] active:scale-[0.98]">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" class="w-4 h-4">
            View Live Reviews
          </a>
          <a href="https://g.page/r/CcF-dDstjsBwEBM/review" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition hover:scale-[1.02] active:scale-[0.98]">
            <i class="fa-solid fa-pen-to-square"></i>
            Leave a Review
          </a>
        </div>
      </div>`;
  newContent = newContent.replace(trustIndexRegex, realTimeReviewsHtml);

  // 2. High-converting H1 Domination Injection (Pure White, Zero "#1", 100% Daily Search Phrasing)
  let customH1Inner = '';
  if (pageType === 'about') {
    customH1Inner = '';
  } else if (pageType === 'gallery') {
    customH1Inner = `Cleaning Results & Service Gallery in <span class="text-pink-300 font-bold">${clean_name === 'Florida' ? 'Florida' : `${clean_name}, FL`}</span>`;

  } else if (pageType === 'blog') {
    customH1Inner = '';
  } else if (pageType === 'login') {
    customH1Inner = '';
  } else {
    // service_or_home: Use dynamic zero-duplicate SEO pack H1, keeping homepage locked to Florida
    if (loc_slug === 'home' && !is_sub_page) {
      customH1Inner = 'Cleaning Services Across Florida';
    } else if (!is_sub_page && loc_slug && !serviceSlugs.includes(loc_slug)) {
      customH1Inner = formatLocationH1(clean_name, loc_slug);
    } else {
      customH1Inner = `${seoPack.h1}`;
    }
  }

  if (customH1Inner) {
    newContent = newContent.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1 class="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.15] mb-4 text-white drop-shadow-lg tracking-tight px-2">${customH1Inner}</h1>`);
    
    // For non-homepage service/location pages, apply standard dynamic hero subhead & pill row
    if (pageType === 'service_or_home' && loc_slug !== 'home') {
      const heroSubText = (!is_sub_page && loc_slug && !serviceSlugs.includes(loc_slug))
        ? (pilot?.heroSub || formatLocationMeta(clean_name, loc_slug))
        : seoPack.heroSub;
      newContent = newContent.replace(/(<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>)[\s\S]*?(<\/p>)/i, `$1${heroSubText}$2`);

      const heroLocations = getNearestLocations(loc_slug, 7);
      const heroLocationPills = heroLocations.map(c => 
        `<a href="${getNearbyUrl(c.slug)}" class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/35 text-white backdrop-blur-md border border-white/30 hover:border-pink-200 hover:scale-105 shadow-sm transition-all duration-200">${c.name}</a>`
      ).join('\n        ');

      const heroLocationsStrip = `
      <!-- Hero Nearby Service Areas Pill Row -->
      <div class="mt-3 mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto px-4" aria-label="Nearby Cleaning Service Locations">
        <span class="inline-flex items-center gap-1.5 text-xs font-bold text-pink-200 uppercase tracking-wider mr-1">
          <i class="fa-solid fa-location-dot text-pink-400"></i> Serving ${clean_name} &amp; Nearby:
        </span>
        ${heroLocationPills}
        <a href="/locations/" class="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-pink-500/85 hover:bg-pink-500 text-white backdrop-blur-md border border-pink-300/40 hover:scale-105 shadow-md transition-all duration-200">
          <span>+ All Locations</span> <i class="fa-solid fa-chevron-right text-[10px]"></i>
        </a>
      </div>`;

      if (newContent.includes('<!-- Hero Nearby Service Areas Pill Row -->')) {
        newContent = newContent.replace(
          /<!-- Hero Nearby Service Areas Pill Row -->[\s\S]*?<\/div>/i,
          heroLocationsStrip.trim()
        );
      } else {
        newContent = newContent.replace(
          /(<h1[^>]*>[\s\S]*?<\/h1>)/i,
          `$1\n${heroLocationsStrip}`
        );
      }
    }
  }

  if (is305Area(loc_slug, clean_name)) {
    // Replace telephone links
    newContent = newContent.replace(/tel:\+?1?[-.]?941[-.]?222[-.]?2080/gi, 'tel:13058516959');
    newContent = newContent.replace(/tel:941-222-2080/gi, 'tel:305-851-6959');
    
    // Replace telephone display text
    newContent = newContent.replace(/(?:\+?1[-.\s]?)?\(?941\)?[-.\s]*222[-.\s]*2080/g, '(305) 851-6959');
    newContent = newContent.replace(/9412222080/g, '3058516959');

    // Replace aria-labels
    newContent = newContent.replace(/aria-label="Call Sweet Maid at [^"]*"/gi, 'aria-label="Call Sweet Maid at (305) 851-6959"');

    // Fix blog script regex replacement if present in blog templates
    newContent = newContent.replace(
      /\.replace\(\/\(1\?\\\(941\\\)\\s\?222-2080\|1\?9412222080\|941-222-2080\)\/g,[\s\S]*?\)/gi,
      `.replace(/(1?\\(941\\)\\s?222-2080|1?9412222080|941-222-2080|1?\\(305\\)\\s?851-6959|1?3058516959|305-851-6959)/g, '<a href="tel:13058516959"><strong>(305) 851-6959</strong></a>')`
    );
  }

  // Final Master Image Processor: Local SEO ALT texts (strictly zero duplicates), decoding="async", remove lazy loading for smooth responsive images across the whole page
  newContent = processPageImages(newContent, clean_name, loc_slug, serviceName, pageType);

  // Global URL Safety Sanitization: Eliminate nested services, Florida-cleaning fallbacks, and malformed hrefs
  const isCityLocation = !!(loc_slug && loc_slug !== 'home' && !serviceSlugs.includes(loc_slug));
  newContent = newContent.replace(/href="\/[^"]*?florida-beach-cleaning\/"/gi, 'href="/locations/"');
  newContent = newContent.replace(/href="\/[^"]*?florida-cleaning\/([a-z0-9-]+)\/"/gi, (match, srv) => {
    return isCityLocation ? `href="/${srv}-${loc_slug}/"` : `href="/${srv}/"`;
  });
  newContent = newContent.replace(/href="\/florida-cleaning\/"/gi, 'href="/locations/"');

  // Collapse any stacked services: [prefix]/[service1]/[service2]/ -> [prefix]/[service2]/ or /[service2]/
  const serviceRegexGroup = serviceSlugs.join('|');
  const cityStackedRegex = new RegExp(`href="(\\/[^"\\/\\s]+)\\/(?:${serviceRegexGroup})\\/(${serviceRegexGroup})\\/"`, 'g');
  newContent = newContent.replace(cityStackedRegex, (match, prefix, targetService) => {
    const cleanPrefix = prefix.replace(/^\//, '');
    if (serviceSlugs.includes(cleanPrefix)) {
      return `href="/${targetService}/"`;
    }
    return `href="/${targetService}-${cleanPrefix}/"`;
  });

  const standaloneStackedRegex = new RegExp(`href="\\/(?:${serviceRegexGroup})\\/(${serviceRegexGroup})\\/"`, 'g');
  newContent = newContent.replace(standaloneStackedRegex, (match, targetService) => {
    return isCityLocation ? `href="/${targetService}-${loc_slug}/"` : `href="/${targetService}/"`;
  });

  // Global banned phrase safety sanitizer
  newContent = newContent.replace(/\bmost trusted\b/gi, 'family-owned');
  newContent = newContent.replace(/\bleading provider\b/gi, 'family-owned provider');

  // Clean any accidental duplicate slashes
  newContent = newContent.replace(/href="\/+/g, 'href="/');

  return newContent;
}
