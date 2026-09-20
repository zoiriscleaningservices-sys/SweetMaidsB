import fs from 'fs';
import path from 'path';
import { serviceSlugs, formatName, getNearestLocations } from './data';
import { miamiBrowardSlugs, is305Area, isMonroeCounty, monroeKeyHubs } from './miami_broward_slugs';
import { isManateeCounty, manateeKeyHubs } from './manatee';
import { generateSeoContentPack } from './seo_engine';

// Service to H1 mapping using top-converting transactional SEO search terms
export const serviceH1Map: Record<string, string> = {
  "house-cleaning": "Top-Rated House Cleaning & Professional Maid Services in",
  "deep-cleaning": "Best Deep House Cleaning & Professional Sanitizing in",
  "move-in-out-cleaning": "Top-Rated Move-In & Move-Out House Cleaning Services in",
  "airbnb-cleaning": "Best Airbnb & Vacation Rental Cleaning Services in",
  "commercial-cleaning": "Top-Rated Commercial & Office Cleaning Services in",
  "post-construction-cleaning": "Professional Post-Construction Cleanup Services in",
  "carpet-cleaning": "Top-Rated Professional Carpet & Rug Cleaning Services in",
  "pressure-washing": "Top-Rated Pressure Washing & Exterior House Washing in",
  "window-cleaning": "Best Professional Window Cleaning Services in",
  "home-watch-services": "Top-Rated Home Watch & Property Care Services in",
  "office-janitorial-services": "Best Office Cleaning & Professional Janitorial Services in",
  "janitorial-cleaning-services": "Top-Rated Janitorial & Commercial Cleaning Services in",
  "medical-dental-facility-cleaning": "Best Medical & Dental Facility Cleaning Services in",
  "industrial-warehouse-cleaning": "Top-Rated Industrial & Warehouse Cleaning Services in",
  "floor-stripping-waxing": "Best Floor Stripping & Waxing Services in",
  "gym-fitness-center-cleaning": "Top-Rated Gym & Fitness Center Cleaning Services in",
  "school-daycare-cleaning": "Best School & Daycare Cleaning Services in",
  "church-worship-center-cleaning": "Premium Church & Worship Center Cleaning Services in",
  "property-management-janitorial": "Best Property Management Janitorial & Cleaning Services in",
  "luxury-estate-cleaning": "Top-Rated Luxury Estate & Mansion Cleaning Services in",
  "solar-panel-cleaning": "Best Solar Panel Cleaning & Professional Washing in",
  "gutter-cleaning": "Top-Rated Gutter Cleaning & Downspout Services in",
  "property-maintenance": "Best Property Maintenance & Handyman Services in",
  "recurring-maid-service": "Top-Rated Recurring Maid Service & Scheduled House Cleaning in"
};


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
  
  if (originalH1Match) {
    const innerH1 = originalH1Match[1].trim();
    if (innerH1.includes('About Sweet Maid Cleaning') || innerH1.includes('About Sweet Maid')) {
      pageType = 'about';
    } else if (innerH1.includes('Our Cleaning Results') || innerH1.includes('Service Gallery')) {
      pageType = 'gallery';
    } else if (innerH1.includes('Welcome Back') || innerH1.includes('login') || innerH1.includes('Client Portal') || innerH1.includes('Cleaning Portal') || innerH1.includes('shining home') || content.includes('bookingkoala.com/login')) {
      pageType = 'login';
    }
  }

  if (content.includes('bookingkoala.com/login')) {
    pageType = 'login';
  }

  // Generate 100% Unique, Zero-Duplicate SEO Content Pack
  const seoPack = generateSeoContentPack(clean_name, loc_slug, serviceName, currentService);

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
    newContent = newContent.replace(/#1 Rated Cleaning Service in Bradenton/gi, '#1 Rated Professional Maid & Cleaning Services');
    newContent = newContent.replace(/#1 Rated Cleaning Service in [^<|]+/gi, '#1 Rated Professional Maid & Cleaning Services ');
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
  } else {
    // Aggressive SEO location and service targeting
    newContent = newContent.replace(/Bradenton’s/gi, `${clean_name}'s`).replace(/Bradenton's/gi, `${clean_name}'s`);
    newContent = newContent.replace(/across Bradenton and Southwest Florida/gi, `across ${clean_name} and Southwest Florida`);
    newContent = newContent.replace(/in Bradenton home/gi, `in ${clean_name} home`);
    newContent = newContent.replace(/Favorite Cleaners in Bradenton/gi, `Favorite Cleaners in ${clean_name}`);
    newContent = newContent.replace(/Top Rated in Bradenton/gi, `Top Rated in ${clean_name}`);
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
    
    // Inject exact keyword into generic paragraph descriptions to fulfill "top to bottom" request
    newContent = newContent.replace(/Why Florida Trusts Us/gi, `Why ${clean_name} Trusts Us`);
    newContent = newContent.replace(/Why Locals Trust Us/gi, `Why ${clean_name} Trusts Us`);
    newContent = newContent.replace(/Florida's most trusted cleaning service/gi, `${clean_name}'s most trusted ${serviceName.toLowerCase()}`);
    newContent = newContent.replace(/Professional, reliable, and friendly cleaning services for Florida and surrounding areas/gi, `Professional, reliable, and friendly ${serviceName.toLowerCase()} for ${clean_name} and surrounding areas`);
    
    // SEO Google Images Domination: Append target keyword to EVERY image alt tag
    newContent = newContent.replace(/alt="([^"]*)"/gi, `alt="$1 - Top ${serviceName} in ${clean_name}, FL"`);
  }
  
  // Purge any references to non-working / decommissioned service pages from header, mobile menu, and footer
  newContent = newContent.replace(/<li[^>]*>\s*<a[^>]*href="[^"]*(?:airbnb-vacation-rental-management|luxury-estate-management)[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/li>/gi, '');
  newContent = newContent.replace(/<a[^>]*href="[^"]*(?:airbnb-vacation-rental-management|luxury-estate-management)[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

  // Clean, 8-8-8 Aligned Header Services Mega Menu
  const alignedMegaMenuHtml = `<!-- Services Dropdown (Mega Menu) -->
          <div class="nav-dropdown">
            <button
              class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-pink-300 transition-colors py-8">
              Services <i class="fa-solid fa-chevron-down text-xs"></i>
            </button>
            <div
              class="dropdown-menu -left-32 w-[800px] bg-white rounded-3xl shadow-2xl border border-pink-100 p-8 mt-0">
              <div class="grid grid-cols-3 gap-8">
                <!-- Residential Column -->
                <div>
                  <div class="text-xs font-bold text-pink-300 uppercase tracking-wider mb-4 px-2">Residential &
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
                  <div class="text-xs font-bold text-pink-300 uppercase tracking-wider mb-4 px-2">Commercial &
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
                  <div class="text-xs font-bold text-pink-300 uppercase tracking-wider mb-4 px-2">Specialized &
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
            </div>
          </div>\n          `;

  const alignedMobileServicesHtml = `<!-- Residential & Management -->
              <div class="text-[10px] font-bold text-pink-300 uppercase tracking-widest px-3 mt-2 mb-1">Residential &
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
              <div class="text-[10px] font-bold text-pink-300 uppercase tracking-widest px-3 mt-4 mb-1">Commercial &
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
              <div class="text-[10px] font-bold text-pink-300 uppercase tracking-widest px-3 mt-4 mb-1">Specialized &
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
              `;

  newContent = newContent.replace(
    /<!--\s*Services Dropdown\s*\(Mega Menu\)\s*-->[\s\S]*?(?=<div class="nav-dropdown">\s*<button[^>]*>\s*Locations)/gi,
    alignedMegaMenuHtml
  );

  newContent = newContent.replace(
    /<!--\s*Residential & Management\s*-->[\s\S]*?(?=\s*<\/div>\s*<\/div>\s*<\/div>\s*<div[^>]*class="[^"]*accordion-group)/gi,
    alignedMobileServicesHtml
  );

  // Navigation Links
  for (const s_slug of serviceSlugs) {
    if (pageType !== 'login' && loc_slug) {
      newContent = newContent.replace(new RegExp(`href="/[^/]+/${s_slug}/"`, 'g'), `href="/${loc_slug}/${s_slug}/"`);
      newContent = newContent.replace(new RegExp(`href="/${s_slug}/"`, 'g'), `href="/${loc_slug}/${s_slug}/"`);
      newContent = newContent.replace(new RegExp(`href="https://sweetmaidcleaning.com/${s_slug}/"`, 'g'), `href="https://sweetmaidcleaning.com/${loc_slug}/${s_slug}/"`);
    } else {
      newContent = newContent.replace(new RegExp(`href="/[^/]+/${s_slug}/"`, 'g'), `href="/${s_slug}/"`);
    }
  }
  
  if (pageType !== 'login' && loc_slug) {
    newContent = newContent.replace(/href="\/[^/]+\/about\/"/g, `href="/${loc_slug}/about/"`);
    newContent = newContent.replace(/href="\/about\/"/g, `href="/${loc_slug}/about/"`);
    
    newContent = newContent.replace(/href="\/[^/]+\/gallery\/"/g, `href="/${loc_slug}/gallery/"`);
    newContent = newContent.replace(/href="\/gallery\/"/g, `href="/${loc_slug}/gallery/"`);

    newContent = newContent.replace(/href="\/[^/]+\/blog\/"/g, `href="/${loc_slug}/blog/"`);
    newContent = newContent.replace(/href="\/blog\/"/g, `href="/${loc_slug}/blog/"`);
  } else {
    newContent = newContent.replace(/href="\/[^/]+\/about\/"/g, `href="/about/"`);
    newContent = newContent.replace(/href="\/[^/]+\/gallery\/"/g, `href="/gallery/"`);
    newContent = newContent.replace(/href="\/[^/]+\/blog\/"/g, `href="/blog/"`);
  }

  // Explicitly fix corrupted Home links and logos
  if (pageType !== 'login' && loc_slug) {
    newContent = newContent.replace(/<a href="[^"]+"([^>]*)>Home<\/a>/gi, `<a href="/${loc_slug}/"$1>Home</a>`);
    newContent = newContent.replace(/<a href="[^"]+"([^>]*)class="flex items-center group">/gi, `<a href="/${loc_slug}/"$1class="flex items-center group">`);
    newContent = newContent.replace(/href="\/home\/"/g, `href="/${loc_slug}/"`);
  } else {
    newContent = newContent.replace(/<a href="[^"]+"([^>]*)>Home<\/a>/gi, `<a href="/"$1>Home</a>`);
    newContent = newContent.replace(/<a href="[^"]+"([^>]*)class="flex items-center group">/gi, `<a href="/"$1class="flex items-center group">`);
    newContent = newContent.replace(/href="\/home\/"/g, `href="/"`);
  }

  // Replace Logo with the new uploaded brand logo
  newContent = newContent.replace(/https:\/\/i\.ibb\.co\/PzPDfC1N\/Whats-App-Image-2026-02-09-at-4-52-59-PM-Picsart-Background-Remover\.png/g, '/images/logo.png');

  // Fix Cross-City Location Links (e.g. href="/anna-maria-cleaning/")
  newContent = newContent.replace(/href="\/([a-z0-9-]+)-cleaning\/"/g, `href="/$1-fl/${currentService}/"`);

  const isSpecificService = serviceSlugs.includes(currentService);
  const targetServiceSuffix = isSpecificService ? `${currentService}/` : '';
  const nearestLocations = getNearestLocations(loc_slug, 8);

  if (pageType !== 'login') {
    // Dynamically compute and inject the 100% geographically nearest locations
    const desktopNearbyHtml = nearestLocations.map(c => 
      `<a href="/${c.slug}/${targetServiceSuffix}" class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">${c.name}</a>`
    ).join('\n');

    const mobileNearbyHtml = nearestLocations.map(c => 
      `<a href="/${c.slug}/${targetServiceSuffix}" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-location-dot text-pink-300 w-5"></i><span>${c.name}</span></a>`
    ).join('\n');

    newContent = newContent.replace(
      /(<div id="nearby-locations-list"[^>]*>)[\s\S]*?(<\/div>\s*<div class="border-t)/i,
      `<div id="nearby-locations-list" class="space-y-1">\n${desktopNearbyHtml}\n</div>\n              <div class="border-t`
    );

    // Direct ANY "View All Locations" link to /locations/
    newContent = newContent.replace(
      /<a\s+[^>]*href="[^"]*"([^>]*>[\s\S]*?View All Locations[\s\S]*?<\/a>)/gi,
      '<a href="/locations/"$1'
    );

    newContent = newContent.replace(
      /(<div id="mobile-nearby-list"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*\n?\s*<a href="[^"]*blog\/)/i,
      `<div id="mobile-nearby-list" class="grid grid-cols-1 gap-2 p-3 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">\n${mobileNearbyHtml}\n</div>\n          </div>\n        </div>\n\n        <a href="/blog/`
    );

    // Also update footer "Locations We Serve" grid with the top 28 closest neighboring locations
    const nearestFooterLocations = getNearestLocations(loc_slug, 28);
    const footerGridHtml = nearestFooterLocations.map(c => 
      `<a href="/${c.slug}/${targetServiceSuffix}" class="hover:text-pink-400 transition-colors">${c.name}</a>`
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
      <a href="/locations/" class="mobile-link flex items-center justify-between p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><span>View All Service Areas</span><i class="fa-solid fa-arrow-right text-xs text-pink-400"></i></a>
      <a href="/house-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-broom text-pink-300 w-5"></i><span>House Cleaning</span></a>
      <a href="/deep-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-sparkles text-pink-300 w-5"></i><span>Deep Cleaning</span></a>
    `;

    newContent = newContent.replace(
      /(<div id="nearby-locations-list"[^>]*>)[\s\S]*?(<\/div>\s*<div class="border-t)/i,
      `<div id="nearby-locations-list" class="space-y-1">\n${loginDesktopNearbyHtml}\n</div>\n              <div class="border-t`
    );

    newContent = newContent.replace(
      /<a\s+[^>]*href="[^"]*"([^>]*>[\s\S]*?View All Locations[\s\S]*?<\/a>)/gi,
      '<a href="/locations/"$1'
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

  // Safely remove redundant search bar section without affecting the Hero section
  newContent = newContent.replace(/<!--\s*=+\s*GLOBAL SEARCH BAR SECTION[\s\S]*?<\/section>/gi, '');
  newContent = newContent.replace(/<!--\s*Let Us Contact You Form\s*-->[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/gi, '');

  // Hide the Locations We Serve footer grid so it remains in the DOM for React to scrape, but is invisible to the user.
  newContent = newContent.replace(
    /(<div class="lg:col-span-2">)(\s*<h4[^>]*>\s*<span[^>]*><\/span>Locations We Serve)/,
    '<div class="lg:col-span-2 hidden" style="display: none!important;">$2'
  );

  // Re-organize and re-balance the Footer Layout to compensate for the hidden locations block.
  // 1. Shift master grid from 5 columns to 4 columns
  newContent = newContent.replace(/<div class="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">/g, '<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">');
  
  // 2. Expand "Our Services" to take up the 2 completely vacant grid columns, and split its UL into a 2-column layout.
  newContent = newContent.replace(
    /<div>(\s*<h4[^>]*>\s*<span[^>]*><\/span>Our Services\s*<\/h4>\s*<div[^>]*>\s*<ul class=")([^"]+)(")/i,
    '<div class="lg:col-span-2">$1$2 sm:columns-2 gap-x-8$3'
  );

  // Upgrade Eco-Friendly block flat icon with the Premium CSS-animated Earth Globe
  const GLOBE_HTML = `<style>
        @keyframes earthRotate { 0% { background-position: 0 0; } 100% { background-position: 400px 0; } }
        @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
      </style>
      <div class="flex items-center justify-center mb-8">
        <div class="relative w-[200px] h-[200px] rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.2),-5px_0_8px_#c3f4ff_inset,15px_2px_25px_#000_inset,-24px_-2px_34px_#c3f4ff99_inset,200px_0_44px_#00000066_inset,100px_0_38px_#000000aa_inset]" style="background-image: url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg'); background-size: cover; background-position: left; animation: earthRotate 30s linear infinite;">
          <div class="absolute left-[-20px] w-1 h-1 bg-white rounded-full" style="animation: twinkling 3s infinite"></div>
          <div class="absolute left-[-40px] top-[30px] w-1 h-1 bg-white rounded-full" style="animation: twinkling-slow 2s infinite"></div>
          <div class="absolute left-[150px] top-[90px] w-1 h-1 bg-white rounded-full" style="animation: twinkling-long 4s infinite"></div>
          <div class="absolute left-[100px] top-[180px] w-1 h-1 bg-white rounded-full" style="animation: twinkling 3s infinite"></div>
          <div class="absolute left-[50px] top-[150px] w-1 h-1 bg-white rounded-full" style="animation: twinkling-fast 1.5s infinite"></div>
          <div class="absolute left-[180px] top-[20px]. w-1 h-1 bg-white rounded-full" style="animation: twinkling-long 4s infinite"></div>
          <div class="absolute left-[90px] top-[60px] w-1 h-1 bg-white rounded-full" style="animation: twinkling-slow 2s infinite"></div>
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

  // Defer third-party lead generation scripts with interaction-based loader (0ms TBT)
  newContent = newContent.replace(
    /<script\s+src="https:\/\/widgets\.leadconnectorhq\.com\/loader\.js"[^>]*><\/script>/gi,
    `<script>
      function loadLC(){
        if(window._lc_loaded) return;
        window._lc_loaded = true;
        var s = document.createElement('script');
        s.src = "https://widgets.leadconnectorhq.com/loader.js";
        s.async = true;
        document.body.appendChild(s);
      }
      ['scroll','touchstart','mousemove','click'].forEach(function(e){
        window.addEventListener(e, loadLC, {once:true, passive:true});
      });
      setTimeout(loadLC, 3500);
    </script>`
  );
  newContent = newContent.replace(
    /<script\s+src="https:\/\/link\.msgsndr\.com\/js\/form_embed\.js"[^>]*><\/script>/gi,
    `<script>
      function loadForm(){
        if(window._form_loaded) return;
        window._form_loaded = true;
        var s = document.createElement('script');
        s.src = "https://link.msgsndr.com/js/form_embed.js";
        s.async = true;
        document.body.appendChild(s);
      }
      ['scroll','touchstart','mousemove','click'].forEach(function(e){
        window.addEventListener(e, loadForm, {once:true, passive:true});
      });
      setTimeout(loadForm, 3500);
    </script>`
  );

  // 2. Accessibility & Social Links Enhancements
  newContent = newContent.replace(/<a([^>]*class="[^"]*lg:hidden[^"]*"[^>]*)>/gi, '<a aria-label="Call Sweet Maid at (941) 222-2080"$1>');
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
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/locations\/?"[^>]*)>/gi, '<a aria-label="Browse all Florida cleaning locations"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/booknow\/?"[^>]*)>/gi, '<a aria-label="Book a professional cleaning service now"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/book-online\/?"[^>]*)>/gi, '<a aria-label="Book your cleaning service online"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/about\/?"[^>]*)>/gi, '<a aria-label="About Sweet Maid cleaning company"$1>');

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

  // 4. Mobile Slide-Out Drawer: Convert bottom CTA button to "Book Online"
  newContent = newContent.replace(
    /<a\s+[^>]*onclick="closeMenu\(\)"[^>]*>[\s\S]*?<\/a>/gi,
    `<a href="/book-online/" class="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white text-center rounded-2xl py-4 font-bold shadow-lg shadow-pink-300/50 hover:shadow-xl transition-all flex items-center justify-center gap-2" aria-label="Book your cleaning service online"><i class="fa-solid fa-calendar-check text-white"></i> Book Online</a>`
  );
  // 5. Footer Links: Add Privacy Policy & Terms and Conditions (Footer Only)
  newContent = newContent.replace(
    /(<footer[\s\S]*?)(<a\s+[^>]*href="\/sitemap\.xml"[^>]*>Sitemap<\/a>)/i,
    `$1<a href="/privacy-policy/" class="hover:text-pink-400 transition-colors" aria-label="Read Sweet Maid Privacy Policy">Privacy Policy</a>\n          <a href="/terms-and-conditions/" class="hover:text-pink-400 transition-colors" aria-label="Read Sweet Maid Terms and Conditions">Terms & Conditions</a>\n          $2`
  );

  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/blog\/?"[^>]*)>/gi, '<a aria-label="Read cleaning tips on Sweet Maid blog"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/gallery\/?"[^>]*)>/gi, '<a aria-label="View Sweet Maid before and after cleaning gallery"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/login\/?"[^>]*)>/gi, '<a aria-label="Customer portal login"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="#"[^>]*)>/gi, '<a aria-label="Sweet Maid Cleaning Service Details"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*)>/gi, '<a aria-label="Sweet Maid Cleaning Services Florida"$1>');

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

  // 7. Image Alt Text: Ensure every <img> has descriptive alt
  newContent = newContent.replace(/<img\s+(?![^>]*\balt=)([^>]+)>/gi, `<img alt="Sweet Maid Professional Cleaning Service in ${clean_name}, Florida" $1>`);
  newContent = newContent.replace(/alt=""/gi, `alt="Sweet Maid Cleaning Service in ${clean_name}, FL"`);

  // 8. Image Paths, Dimensions & WebP Next-Gen Format Upgrade
  newContent = newContent.replace(/src=["'](?:\.\.\/)+images\//gi, 'src="/images/');
  newContent = newContent.replace(/src=["']images\//gi, 'src="/images/');
  newContent = newContent.replace(/url\(['"]?(?:\.\.\/)+images\//gi, "url('/images/");
  newContent = newContent.replace(/url\(['"]?images\//gi, "url('/images/");
  newContent = newContent.replace(/\/images\/([^"')]+)\.jpeg/gi, '/images/$1.webp');

  // Strip redundant client-side Tailwind script from templates (Next.js compiles Tailwind natively)
  newContent = newContent.replace(/<script[^>]*cdn\.tailwindcss\.com[^>]*><\/script>/gi, '');

  // Prioritize hero image for fast LCP, add explicit dimensions, lazy-load remaining images
  let heroImageHandled = false;
  newContent = newContent.replace(/<img\s+([^>]+)>/gi, (match, attrs) => {
    let cleanAttrs = attrs;
    if (!cleanAttrs.includes('width=') && !cleanAttrs.includes('height=')) {
      cleanAttrs += ' width="800" height="600"';
    }
    if (!heroImageHandled && (cleanAttrs.includes('hero') || cleanAttrs.includes('banner') || cleanAttrs.includes('logo'))) {
      heroImageHandled = true;
      return `<img fetchpriority="high" decoding="async" ${cleanAttrs.replace(/\s*loading=["']lazy["']/gi, '')}>`;
    }
    if (!cleanAttrs.includes('loading=')) {
      return `<img loading="lazy" decoding="async" ${cleanAttrs}>`;
    }
    return `<img ${cleanAttrs}>`;
  });

  // 9. Accessibility: Sequential Heading Hierarchy (H1 -> H2 -> H3 -> H4)
  newContent = newContent.replace(/<h3 class="text-2xl font-bold text-center text-gray-800 mb-6 drop-shadow-sm">Find Services In Your City<\/h3>/gi, '<h2 class="text-2xl font-bold text-center text-gray-800 mb-6 drop-shadow-sm">Find Services In Your City</h2>');
  newContent = newContent.replace(/<h4 class="font-bold text-lg mb-1">/gi, '<h3 class="font-bold text-lg mb-1">');
  newContent = newContent.replace(/<h4 class="text-3xl font-bold mb-4 text-gray-900">100% Eco-Friendly Options<\/h4>/gi, '<h3 class="text-3xl font-bold mb-4 text-gray-900">100% Eco-Friendly Options</h3>');
  newContent = newContent.replace(/<h4 class="font-bold text-gray-900">([^<]+)<\/h4>/gi, '<h3 class="font-bold text-gray-900">$1</h3>');
  newContent = newContent.replace(/<h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Explore Nearby Cleaning Services<\/h4>/gi, '<h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Explore Nearby Cleaning Services</h3>');
  newContent = newContent.replace(/<h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">/gi, '<h3 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">');

  // Fix Map Headings and Pin Labels
  newContent = newContent.replace(/<h2 class="text-4xl font-bold mt-3 mb-6">Proudly Serving.*?<\/h2>/gi, `<h2 class="text-4xl font-bold mt-3 mb-6">Proudly Serving ${clean_name}</h2>`);

  // Maps - Google Business Profile ONLY for Bradenton HQ & all Manatee County locations vs Dynamic City Query for all other pages
  const isManatee = isManateeCounty(loc_slug, clean_name) && !serviceSlugs.includes(loc_slug);

  if (isManatee) {
    const loc_query = encodeURIComponent('Sweet Maid Cleaning Service, 14651 Westbrook Cir Apt 312, Bradenton, FL 34211');
    const map_url = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${loc_query}+()&t=&z=15&ie=UTF8&iwloc=B&output=embed`;
    const gbpBadgeHtml = `<a href="https://www.google.com/maps/search/?api=1&query=Sweet+Maid+Cleaning+Service+Bradenton+FL&query_place_id=ChIJXVApokD-1woRwX50Oy2OwHA" target="_blank" rel="noopener noreferrer" class="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md hover:bg-white hover:text-pink-600 transition-all flex items-center gap-2 text-gray-900 border border-gray-100 group z-10">
            <i class="fa-solid fa-location-dot text-pink-400 group-hover:scale-110 transition-transform"></i>
            <span><strong>Sweet Maid Cleaning Service</strong> • 14651 Westbrook Cir Apt 312, Bradenton, FL</span>
          </a>`;

    newContent = newContent.replace(/src="https:\/\/maps\.google\.com\/maps[^"]*"/gi, `src="${map_url}"`);
    newContent = newContent.replace(/src="https:\/\/www\.google\.com\/maps\/embed[^"]*"/gi, `src="${map_url}"`);
    newContent = newContent.replace(/<div class="absolute bottom-4 left-4 bg-white\/90[^>]*>[\s\S]*?<\/div>/gi, gbpBadgeHtml);
    newContent = newContent.replace(/<a[^>]+query_place_id=ChIJXVApokD-1woRwX50Oy2OwHA[^>]*>[\s\S]*?<\/a>/gi, gbpBadgeHtml);
  } else if (pageType !== 'login') {
    // All other cities: Miami, Tampa, Orlando, Sarasota, Jacksonville, etc.
    const loc_query = encodeURIComponent(`${clean_name}, Florida`);
    const map_url = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${loc_query}+()&t=&z=13&ie=UTF8&iwloc=B&output=embed`;
    const cityBadgeHtml = `<div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-semibold shadow-sm">
            📍 Servicing ${clean_name} and surrounding areas
          </div>`;

    newContent = newContent.replace(/src="https:\/\/maps\.google\.com\/maps[^"]*"/gi, `src="${map_url}"`);
    newContent = newContent.replace(/src="https:\/\/www\.google\.com\/maps\/embed[^"]*"/gi, `src="${map_url}"`);
    newContent = newContent.replace(/<a[^>]+query_place_id=ChIJXVApokD-1woRwX50Oy2OwHA[^>]*>[\s\S]*?<\/a>/gi, cityBadgeHtml);
    newContent = newContent.replace(/<div class="absolute bottom-4 left-4 bg-white\/90[^>]*>[\s\S]*?<\/div>/gi, cityBadgeHtml);
    newContent = newContent.replace(/Servicing Florida and surrounding areas/gi, `Servicing ${clean_name} and surrounding areas`);
    newContent = newContent.replace(/Servicing entire 34205, 34209, 34208, 34210 areas/g, `Servicing ${clean_name} and surrounding areas`);
  }

  // Strip raw unlocalized static HYPER-LOCAL SEO BLOCK from source templates
  newContent = newContent.replace(/<!--\s*HYPER-LOCAL SEO BLOCK\s*-->[\s\S]*?<!--\s*END HYPER-LOCAL SEO BLOCK\s*-->/gi, '');

  const serviceDisplayName = formatName(currentService.replace(/-/g, ' '));
  const targetServiceSlug = isSpecificService ? currentService : 'house-cleaning';

  // Smart URL mapper for daily search keywords to create rich internal links
  const getKeywordTargetUrl = (kw: string) => {
    const k = kw.toLowerCase();
    if (k.includes('deep')) return `/${loc_slug}/deep-cleaning/`;
    if (k.includes('move')) return `/${loc_slug}/move-in-out-cleaning/`;
    if (k.includes('airbnb') || k.includes('vacation')) return `/${loc_slug}/airbnb-cleaning/`;
    if (k.includes('commercial') || k.includes('janitorial') || k.includes('office')) return `/${loc_slug}/commercial-cleaning/`;
    if (k.includes('construction') || k.includes('renovation')) return `/${loc_slug}/post-construction-cleaning/`;
    if (k.includes('carpet') || k.includes('rug')) return `/${loc_slug}/carpet-cleaning/`;
    if (k.includes('pressure') || k.includes('wash')) return `/${loc_slug}/pressure-washing/`;
    if (k.includes('window')) return `/${loc_slug}/window-cleaning/`;
    return `/${loc_slug}/house-cleaning/`;
  };

  // Determine local regional authorities
  const isMonroe = isMonroeCounty(loc_slug, clean_name) && !serviceSlugs.includes(loc_slug);
  const is305 = is305Area(loc_slug, clean_name);
  const localPhoneDisplay = is305 ? '(305) 851-6959' : '(941) 222-2080';
  const localPhoneHref = is305 ? 'tel:13058516959' : 'tel:9412222080';

  // Internal Location Linking for Manatee County, Florida Keys / Monroe County, or Regional nearest locations
  const internalLocationLinksHtml = isManatee
    ? manateeKeyHubs.map(hub => {
        const isCurrent = hub.slug === loc_slug;
        if (isCurrent) {
          return `<span class="px-3.5 py-2 rounded-xl bg-pink-100 text-pink-800 font-bold flex items-center gap-2 shadow-2xs"><i class="fa-solid fa-location-dot text-xs text-pink-600"></i><span>${hub.name}</span></span>`;
        }
        return `<a href="/${hub.slug}/${targetServiceSlug}/" class="px-3.5 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2 group"><i class="fa-solid fa-chevron-right text-[10px] text-pink-300 group-hover:translate-x-0.5 transition-transform"></i><span>${hub.name}</span></a>`;
      }).join('\n')
    : isMonroe
    ? monroeKeyHubs.map(hub => {
        const isCurrent = hub.slug === loc_slug;
        if (isCurrent) {
          return `<span class="px-3.5 py-2 rounded-xl bg-pink-100 text-pink-800 font-bold flex items-center gap-2 shadow-2xs"><i class="fa-solid fa-location-dot text-xs text-pink-600"></i><span>${hub.name}</span></span>`;
        }
        return `<a href="/${hub.slug}/${targetServiceSlug}/" class="px-3.5 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2 group"><i class="fa-solid fa-chevron-right text-[10px] text-pink-300 group-hover:translate-x-0.5 transition-transform"></i><span>${hub.name}</span></a>`;
      }).join('\n')
    : nearestLocations.map(c => {
        return `<a href="/${c.slug}/${targetServiceSuffix}" class="px-3.5 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2 group"><i class="fa-solid fa-chevron-right text-[10px] text-pink-300 group-hover:translate-x-0.5 transition-transform"></i><span>${c.name}</span></a>`;
      }).join('\n');

  // Internal Service Linking for the current location
  const keyLocalServices = [
    { name: `House Cleaning in ${clean_name}`, slug: 'house-cleaning', icon: 'fa-house' },
    { name: `Deep Cleaning in ${clean_name}`, slug: 'deep-cleaning', icon: 'fa-soap' },
    { name: `Move-In & Move-Out Cleaning`, slug: 'move-in-out-cleaning', icon: 'fa-boxes-packing' },
    { name: `Airbnb & Vacation Rental Cleaning`, slug: 'airbnb-cleaning', icon: 'fa-key' },
    { name: `Commercial & Office Cleaning`, slug: 'commercial-cleaning', icon: 'fa-building' },
    { name: `Post-Construction Cleaning`, slug: 'post-construction-cleaning', icon: 'fa-hammer' },
    { name: `Professional Carpet Cleaning`, slug: 'carpet-cleaning', icon: 'fa-rug' },
    { name: `Pressure Washing & Soft Wash`, slug: 'pressure-washing', icon: 'fa-water' },
    { name: `Window Cleaning Services`, slug: 'window-cleaning', icon: 'fa-table-cells-large' },
    { name: `Recurring Maid Service`, slug: 'recurring-maid-service', icon: 'fa-calendar-check' },
  ];

  const localServicesLinksHtml = keyLocalServices.map(srv => {
    const isCurrent = srv.slug === currentService;
    if (isCurrent) {
      return `<span class="px-3.5 py-2.5 rounded-xl bg-pink-100 text-pink-800 font-bold flex items-center gap-2.5 shadow-2xs"><i class="fa-solid ${srv.icon} text-xs text-pink-600"></i><span>${srv.name}</span></span>`;
    }
    return `<a href="/${loc_slug}/${srv.slug}/" class="px-3.5 py-2.5 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition flex items-center gap-2.5 group"><i class="fa-solid ${srv.icon} text-xs text-pink-400 group-hover:scale-110 transition-transform"></i><span>${srv.name}</span></a>`;
  }).join('\n');

  // Aggressive SEO Daily Search Query Matrix & Regional Authority Internal Linking Network
  const seoSection = `
  <section class="py-16 bg-white border-t border-pink-100/70">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      
      <!-- Hyper-Local Authority Content Block -->
      <div class="max-w-4xl mx-auto text-center mb-14">
        <div class="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
          <i class="fa-solid fa-award"></i>
          <span>${isManatee ? 'Manatee County Local Service Authority' : isMonroe ? 'Florida Keys & Monroe County Local Service Authority' : 'Local Cleaning Service Authority'}</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">Providing Top-Tier ${serviceDisplayName} in ${clean_name}, FL</h2>
        <p class="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
          As the leading provider of professional <strong>${serviceDisplayName} in ${clean_name}, FL</strong>${isManatee ? ' and across Manatee County' : isMonroe ? ' and throughout the Florida Keys' : ' and the surrounding areas'}, Sweet Maid is dedicated to maintaining the highest cleanliness standards for your property. Whether you are looking for top-rated <strong>${serviceDisplayName} in ${clean_name}</strong>, scheduled recurring visits, or intensive turnover cleaning, our licensed, bonded, and insured team is always nearby and ready to deliver spotless perfection.
        </p>
        <p class="text-gray-600 leading-relaxed text-sm md:text-base mb-6">
          Don't settle for less when it comes to the hygiene, freshness, and appearance of your space in ${clean_name}, FL. Join countless satisfied locals who rely on our trusted professional cleaners.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="/${loc_slug}/${currentService}/#quote" class="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 text-sm md:text-base">
            <i class="fa-solid fa-sparkles"></i>
            <span>Get Your Free ${clean_name} ${serviceDisplayName} Quote</span>
          </a>
          <a href="${localPhoneHref}" class="inline-flex items-center gap-2 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 font-bold px-6 py-3 rounded-full shadow-xs transition-all hover:scale-105 text-sm md:text-base">
            <i class="fa-solid fa-phone text-pink-500"></i>
            <span>${localPhoneDisplay}</span>
          </a>
        </div>
      </div>

      <!-- Popular Daily Searches Matrix (with Clickable Internal Anchor Links) -->
      <div class="bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 rounded-3xl p-8 md:p-12 border border-pink-100/80 mb-14">
        <div class="text-center mb-8 max-w-3xl mx-auto">
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 font-serif">${seoPack.dailySearchHeading}</h3>
          <p class="text-gray-600 mt-3 text-sm md:text-base leading-relaxed">${seoPack.searchContextParagraph}</p>
        </div>
        <div class="flex flex-wrap justify-center gap-3">
          ${seoPack.dailySearchKeywords.map(tag => `
            <a href="${getKeywordTargetUrl(tag)}" class="inline-flex items-center gap-2 bg-white text-pink-700 border border-pink-200/90 px-4 py-2.5 rounded-full text-sm font-medium shadow-2xs hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all hover:scale-105 active:scale-95">
              <i class="fa-solid fa-magnifying-glass text-xs opacity-60"></i>
              <span>${tag}</span>
            </a>
          `).join('')}
        </div>
      </div>

      <!-- Comprehensive County & Service Internal Linking Hub -->
      <div class="pt-6">
        <div class="text-center mb-10 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 bg-pink-100/90 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <i class="fa-solid fa-network-wired"></i>
            <span>${isManatee ? 'Manatee County Service Network' : isMonroe ? 'Florida Keys Service Network' : 'Regional Cleaning Network'}</span>
          </div>
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 font-serif">${isManatee ? 'Explore Sweet Maid Across Manatee County' : isMonroe ? 'Explore Sweet Maid Across the Florida Keys' : `Explore Nearby Service Locations Around ${clean_name}`}</h3>
          <p class="text-gray-600 mt-2 text-sm md:text-base">${isManatee ? 'Sweet Maid proudly provides licensed and insured maid services across all communities in Manatee County, Florida.' : isMonroe ? 'Sweet Maid proudly provides licensed and insured maid services across all island communities in the Florida Keys & Monroe County.' : `Connecting top-rated home cleaning services across ${clean_name} and neighboring areas.`}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Regional Locations Linking -->
          <div class="bg-white p-6 md:p-8 rounded-2xl border border-pink-100 shadow-xs">
            <div class="flex items-center gap-3 mb-5 pb-3 border-b border-pink-50">
              <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg">
                <i class="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">${isManatee ? 'Manatee County Cities & Areas' : isMonroe ? 'Florida Keys Islands & Towns' : 'Nearby Communities'}</h4>
                <p class="text-xs text-gray-500">Find ${serviceDisplayName} in neighboring towns</p>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              ${internalLocationLinksHtml}
            </div>
          </div>

          <!-- Key Services in Current Location Linking -->
          <div class="bg-white p-6 md:p-8 rounded-2xl border border-pink-100 shadow-xs">
            <div class="flex items-center gap-3 mb-5 pb-3 border-b border-pink-50">
              <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg">
                <i class="fa-solid fa-broom"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">Popular Cleaning Services in ${clean_name}</h4>
                <p class="text-xs text-gray-500">Comprehensive cleaning solutions for every need</p>
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

  if (pageType !== 'login' && newContent.includes('<footer')) {
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
    </div>
  </section>
  `;

  // Inject Climate Section above Footer
  if (pageType !== 'login' && newContent.includes('<footer')) {
    newContent = newContent.replace(/<footer/i, climateSectionHtml + '\n<footer');
  }

  // Inject Structured JSON-LD Schema
  if (pageType !== 'login') {
    newContent += `\n<script type="application/ld+json">${seoPack.schemaJson}</script>`;
  } else {
    const loginSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Customer Portal & Account Login | Sweet Maid Cleaning Services",
      "description": "Log in to your Sweet Maid Cleaning customer portal. Easily schedule recurring maid services, book deep home cleanings, manage appointments, and view invoices.",
      "url": "https://sweetmaidcleaning.com/login/",
      "provider": {
        "@type": "CleaningService",
        "name": "Sweet Maid Cleaning Service",
        "url": "https://sweetmaidcleaning.com/",
        "telephone": "+1-941-222-2080",
        "email": "sweetmaidcleaning@gmail.com",
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
    newContent += `\n<script type="application/ld+json">${JSON.stringify(loginSchema)}</script>`;
  }

  // Swap out the static generic FAQ accordion block with the SEO-maximized dynamic block
  const staticFaqBlockRegex = /<div class="space-y-4">\s*<!-- Q1 -->[\s\S]*?protect you and your home\.\s*<\/p>\s*<\/details>\s*<\/div>/i;
  newContent = newContent.replace(staticFaqBlockRegex, dynamicFaqHtml);
  const showLiveElfsight = isManatee;

  // Swap out the static truncated reviews carousel with full, untruncated reviews and working links (or Elfsight widget for Manatee County)
  const reviewsCarouselRegex = /<!-- Reviews Carousel -->[\s\S]*?(?=<!-- Trustindex Badge -->|<!-- Trustindex & Google Reviews Action Links -->)/gi;
  const bradentonElfsightHtml = `<!-- Reviews Carousel -->
      <div class="mt-16">
        <!-- Elfsight Google Reviews | Untitled Google Reviews -->
        <script src="https://elfsightcdn.com/platform.js" async></script>
        <div class="elfsight-app-155f35e3-448d-4bc2-b8c4-fc9011f6424c" data-elfsight-app-lazy></div>
      </div>
      
      `;
  const fullReviewsCarouselHtml = showLiveElfsight ? bradentonElfsightHtml : `<!-- Reviews Carousel -->
      <div class="relative mt-16">
        <div class="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide" id="reviews-carousel">

          <!-- Review Card 1 -->
          <div
            class="min-w-[320px] md:min-w-[380px] bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 snap-start flex flex-col justify-between">
            <div>
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-12 h-12 rounded-full bg-pink-300 flex items-center justify-center text-gray-800 font-bold text-xl flex-shrink-0">
                  J
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-bold text-gray-900">Justin Fyffe</h4>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google"
                      class="w-6 h-6">
                  </div>
                  <div class="text-sm text-gray-500 mb-2">2025-08-24</div>
                  <div class="flex text-yellow-400 gap-0.5 mb-3">
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-circle-check text-pink-200 text-xs ml-1"></i>
                  </div>
                </div>
              </div>
              <p class="text-gray-700 leading-relaxed">
                I hired Sweet Maid Cleaning Service in Lakewood Ranch for post-construction cleaning and they did an amazing job! If you want a spotless home, they are the ones to call.
              </p>
            </div>
            <div class="mt-4">
              <a href="https://search.google.com/local/reviews?placeid=ChIJXVApokD-1woRwX50Oy2OwHA" target="_blank" rel="noopener noreferrer" class="text-pink-400 hover:text-pink-600 text-sm font-semibold inline-block">Read on Google</a>
            </div>
          </div>

          <!-- Review Card 2 -->
          <div
            class="min-w-[320px] md:min-w-[380px] bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 snap-start flex flex-col justify-between">
            <div>
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center text-gray-800 font-bold text-xl flex-shrink-0">
                  <img loading="lazy" src="https://ui-avatars.com/api/?name=Luis+Jasa&background=3b82f6&color=fff&size=48"
                    alt="Luis Jasa" class="w-full h-full rounded-full">
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-bold text-gray-900">Luis Jasa</h4>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google"
                      class="w-6 h-6">
                  </div>
                  <div class="text-sm text-gray-500 mb-2">2025-08-08</div>
                  <div class="flex text-yellow-400 gap-0.5 mb-3">
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-circle-check text-pink-200 text-xs ml-1"></i>
                  </div>
                </div>
              </div>
              <p class="text-gray-700 leading-relaxed">
                Friendly hardworking employees. Listens to all suggestions.
              </p>
            </div>
            <div class="mt-4">
              <a href="https://search.google.com/local/reviews?placeid=ChIJXVApokD-1woRwX50Oy2OwHA" target="_blank" rel="noopener noreferrer" class="text-pink-400 hover:text-pink-600 text-sm font-semibold inline-block">Read on Google</a>
            </div>
          </div>

          <!-- Review Card 3 -->
          <div
            class="min-w-[320px] md:min-w-[380px] bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 snap-start flex flex-col justify-between">
            <div>
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-800 font-bold text-xl flex-shrink-0">
                  G
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-bold text-gray-900">Gustavo Delgado</h4>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google"
                      class="w-6 h-6">
                  </div>
                  <div class="text-sm text-gray-500 mb-2">2025-07-28</div>
                  <div class="flex text-yellow-400 gap-0.5 mb-3">
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-circle-check text-pink-200 text-xs ml-1"></i>
                  </div>
                </div>
              </div>
              <p class="text-gray-700 leading-relaxed">
                Very good cleaning service in Lakewood Ranch. I will hire them again in the future, the ladies were amazing!
              </p>
            </div>
            <div class="mt-4">
              <a href="https://search.google.com/local/reviews?placeid=ChIJXVApokD-1woRwX50Oy2OwHA" target="_blank" rel="noopener noreferrer" class="text-pink-400 hover:text-pink-600 text-sm font-semibold inline-block">Read on Google</a>
            </div>
          </div>

          <!-- Review Card 4 -->
          <div
            class="min-w-[320px] md:min-w-[380px] bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 snap-start flex flex-col justify-between">
            <div>
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-12 h-12 rounded-full bg-pink-300 flex items-center justify-center text-gray-800 font-bold text-xl flex-shrink-0">
                  D
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-bold text-gray-900">Dayra Delgado</h4>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google"
                      class="w-6 h-6">
                  </div>
                  <div class="text-sm text-gray-500 mb-2">2025-07-25</div>
                  <div class="flex text-yellow-400 gap-0.5 mb-3">
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-star text-sm"></i>
                    <i class="fa-solid fa-circle-check text-pink-200 text-xs ml-1"></i>
                  </div>
                </div>
              </div>
              <p class="text-gray-700 leading-relaxed">
                Sweet Maid Cleaning Service did an incredible job cleaning our home in Sarasota. They were professional, reliable, and thorough. Highly recommend!
              </p>
            </div>
            <div class="mt-4">
              <a href="https://search.google.com/local/reviews?placeid=ChIJXVApokD-1woRwX50Oy2OwHA" target="_blank" rel="noopener noreferrer" class="text-pink-400 hover:text-pink-600 text-sm font-semibold inline-block">Read on Google</a>
            </div>
          </div>

        </div>

        <!-- Navigation Arrows -->
        <button onclick="document.getElementById('reviews-carousel').scrollBy({left: -400, behavior: 'smooth'})"
          class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition">
          <i class="fa-solid fa-chevron-left text-gray-600"></i>
        </button>
        <button onclick="document.getElementById('reviews-carousel').scrollBy({left: 400, behavior: 'smooth'})"
          class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition">
          <i class="fa-solid fa-chevron-right text-gray-600"></i>
        </button>
      </div>
      
      `;
  newContent = newContent.replace(reviewsCarouselRegex, fullReviewsCarouselHtml);

  // Swap out the Trustindex Badge block with real-time links to Google Business Profile reviews (or empty for Bradenton Elfsight widget)
  const trustIndexRegex = /<!-- Trustindex Badge -->\s*<div[^>]*>\s*<div[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi;
  const realTimeReviewsHtml = showLiveElfsight ? `<!-- Elfsight Google Reviews Widget Loaded -->` : `<!-- Trustindex & Google Reviews Action Links -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 border-t border-pink-100/50 pt-8">
        <div
          class="inline-flex items-center gap-2 bg-pink-50 text-pink-600 border border-pink-100 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
          <i class="fa-solid fa-shield-halved"></i>
          Verified by Trustindex
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
    customH1Inner = `Top-Rated House Cleaning & Maid Service Team in <span class="text-pink-300 font-bold">${clean_name}, FL</span>`;
  } else if (pageType === 'gallery') {
    customH1Inner = `Best Cleaning Results & Professional Service Gallery in <span class="text-pink-300 font-bold">${clean_name}, FL</span>`;
  } else if (pageType === 'blog') {
    customH1Inner = `Best Cleaning Tips & Professional Home Care Blog in <span class="text-pink-300 font-bold">${clean_name}, FL</span>`;
  } else if (pageType === 'login') {
    customH1Inner = '';
  } else {
    // service_or_home: Use dynamic zero-duplicate SEO pack H1
    customH1Inner = `${seoPack.h1}`;
  }

  if (customH1Inner) {
    newContent = newContent.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-serif drop-shadow-md">${customH1Inner}</h1>`);
    if (pageType === 'service_or_home') {
      newContent = newContent.replace(/(<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>)[\s\S]*?(<\/p>)/i, `$1${seoPack.heroSub}$2`);
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

  return newContent;
}
