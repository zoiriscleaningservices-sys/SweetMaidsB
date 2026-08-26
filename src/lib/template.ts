import fs from 'fs';
import path from 'path';
import { serviceSlugs, formatName, getNearestLocations } from './data';
import { miamiBrowardSlugs } from './miami_broward_slugs';
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
  "airbnb-vacation-rental-management": "Top-Rated Airbnb & Vacation Rental Property Management in",
  "luxury-estate-management": "Best Luxury Estate & Property Management Services in"
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
    } else if (innerH1.includes('Sweet Maid Cleaning Blog') || innerH1.includes('truewebx-blog-heading')) {
      pageType = 'blog';
    } else if (innerH1.includes('Welcome Back') || innerH1.includes('login')) {
      pageType = 'login';
    }
  }

  // Generate 100% Unique, Zero-Duplicate SEO Content Pack
  const seoPack = generateSeoContentPack(clean_name, loc_slug, serviceName, currentService);

  // Dynamic H1 in pure White with zero duplicate probability
  newContent = newContent.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-serif drop-shadow-md">${seoPack.h1}</h1>`);

  // Dynamic Hero Subtitle
  newContent = newContent.replace(/(<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>)[\s\S]*?(<\/p>)/i, `$1${seoPack.heroSub}$2`);

  // Dynamic Safe Text Replacements for H1 without destroying HTML tags
  newContent = newContent.replace(/Best Cleaning Services in/gi, `${serviceName} in`);
  newContent = newContent.replace(/House Cleaning Services in/gi, `${serviceName} in`);
  newContent = newContent.replace(/House Cleaning in/gi, `${serviceName} in`);

  // Strip ALL legacy favicon tags from templates to prevent Next.js Vercel Triangle fallback
  newContent = newContent.replace(/<link rel="icon"[^>]*>/gi, '');
  newContent = newContent.replace(/<link rel="apple-touch-icon"[^>]*>/gi, '');
  newContent = newContent.replace(/<link rel="shortcut icon"[^>]*>/gi, '');
  
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
  
  // Inject exact keyword into generic paragraph descriptions to fulfill "top to bottom" request
  newContent = newContent.replace(/Florida's most trusted cleaning service/gi, `${clean_name}'s most trusted ${serviceName.toLowerCase()}`);
  newContent = newContent.replace(/Professional, reliable, and friendly cleaning services for Florida and surrounding areas/gi, `Professional, reliable, and friendly ${serviceName.toLowerCase()} for ${clean_name} and surrounding areas`);
  
  // SEO Google Images Domination: Append target keyword to EVERY image alt tag
  newContent = newContent.replace(/alt="([^"]*)"/gi, `alt="$1 - Top ${serviceName} in ${clean_name}, FL"`);
  
  // Navigation Links
  for (const s_slug of serviceSlugs) {
    newContent = newContent.replace(new RegExp(`href="/[^/]+/${s_slug}/"`, 'g'), `href="/${loc_slug}/${s_slug}/"`);
    newContent = newContent.replace(new RegExp(`href="/${s_slug}/"`, 'g'), `href="/${loc_slug}/${s_slug}/"`);
    newContent = newContent.replace(new RegExp(`href="https://sweetmaidcleaning.com/${s_slug}/"`, 'g'), `href="https://sweetmaidcleaning.com/${loc_slug}/${s_slug}/"`);
  }
  
  newContent = newContent.replace(/href="\/[^/]+\/about\/"/g, `href="/${loc_slug}/about/"`);
  newContent = newContent.replace(/href="\/about\/"/g, `href="/${loc_slug}/about/"`);
  
  newContent = newContent.replace(/href="\/[^/]+\/gallery\/"/g, `href="/${loc_slug}/gallery/"`);
  newContent = newContent.replace(/href="\/gallery\/"/g, `href="/${loc_slug}/gallery/"`);

  newContent = newContent.replace(/href="\/[^/]+\/blog\/"/g, `href="/${loc_slug}/blog/"`);
  newContent = newContent.replace(/href="\/blog\/"/g, `href="/${loc_slug}/blog/"`);

  // Explicitly fix corrupted Home links and logos
  newContent = newContent.replace(/<a href="[^"]+"([^>]*)>Home<\/a>/gi, `<a href="/${loc_slug}/"$1>Home</a>`);
  newContent = newContent.replace(/<a href="[^"]+"([^>]*)class="flex items-center group">/gi, `<a href="/${loc_slug}/"$1class="flex items-center group">`);
  
  newContent = newContent.replace(/href="\/home\/"/g, `href="/${loc_slug}/"`);

  // Replace Logo with the new uploaded brand logo
  newContent = newContent.replace(/https:\/\/i\.ibb\.co\/PzPDfC1N\/Whats-App-Image-2026-02-09-at-4-52-59-PM-Picsart-Background-Remover\.png/g, '/images/logo.png');

  // Fix Cross-City Location Links (e.g. href="/anna-maria-cleaning/")
  newContent = newContent.replace(/href="\/([a-z0-9-]+)-cleaning\/"/g, `href="/$1-fl/${currentService}/"`);

  // Dynamically compute and inject the 100% geographically nearest locations
  const nearestLocations = getNearestLocations(loc_slug, 8);
  const isSpecificService = serviceSlugs.includes(currentService);
  const targetServiceSuffix = isSpecificService ? `${currentService}/` : '';

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

  // Strip native inline onclick to let React ClientInteractions intercept it perfectly
  newContent = newContent.replace(/onclick="this\.parentElement\.classList\.toggle\('accordion-active'\)"/gi, "");

  // Eliminate ONLY the pink button locations grid from the Service Areas section while preserving the Map
  newContent = newContent.replace(/<div class="grid grid-cols-2 md:grid-cols-4 gap-3">[\s\S]*?<\/div>/g, '');

  // Replace Unsplash placeholders with unique ultra-realistic AI images
  newContent = newContent.replace('https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&amp;fit=crop&amp;q=80', '../../../images/carpet-cleaning.jpeg');
  newContent = newContent.replace('https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&amp;fit=crop&amp;q=80', '../../../images/window-cleaning.jpeg');

  // Eliminate the "Let Our Team Contact You" floating horizontal form (string block removal)
  const formStartStr = '<!-- Let Us Contact You Form -->';
  const formEndStr = '<div class="grid lg:grid-cols-2 gap-12';
  if (newContent.includes(formStartStr)) {
    const parts = newContent.split(formStartStr);
    newContent = parts[0] + parts.slice(1).map(part => {
      const idx = part.indexOf(formEndStr);
      return idx !== -1 ? part.substring(idx) : part;
    }).join('');
  }

  // Eliminate the GLOBAL SEARCH BAR SECTION
  const searchKey = 'GLOBAL SEARCH BAR SECTION';
  const searchStartIdx = newContent.indexOf(searchKey);
  if (searchStartIdx !== -1) {
    const commentStartIdx = newContent.lastIndexOf('<!--', searchStartIdx);
    const sectionEndIdx = newContent.indexOf('</section>', searchStartIdx);
    if (commentStartIdx !== -1 && sectionEndIdx !== -1) {
      newContent = newContent.substring(0, commentStartIdx) + newContent.substring(sectionEndIdx + '</section>'.length);
    }
  }

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

  // 2. Accessibility: Icon-Only Links & Social Links
  newContent = newContent.replace(/<a([^>]*class="[^"]*lg:hidden[^"]*"[^>]*)>/gi, '<a aria-label="Call Sweet Maid at (941) 222-2080"$1>');
  newContent = newContent.replace(/<a\s+href="tel:([^"]+)"(?![^>]*aria-label)([^>]*)>/gi, `<a href="tel:$1" aria-label="Call Sweet Maid at $1"$2>`);
  newContent = newContent.replace(/<a\s+href="([^"]*facebook[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Follow Sweet Maid on Facebook" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*instagram[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Follow Sweet Maid on Instagram" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*tiktok[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Follow Sweet Maid on TikTok" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a\s+href="([^"]*youtube[^"]*)"(?![^>]*aria-label)([^>]*)>/gi, '<a href="$1" aria-label="Follow Sweet Maid on YouTube" rel="noopener noreferrer"$2>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/locations\/?"[^>]*)>/gi, '<a aria-label="Browse all Florida cleaning locations"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/booknow\/?"[^>]*)>/gi, '<a aria-label="Book a professional cleaning service now"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/book-online\/?"[^>]*)>/gi, '<a aria-label="Book your cleaning service online"$1>');
  newContent = newContent.replace(/<a(?![^>]*aria-label)([^>]*href="\/about\/?"[^>]*)>/gi, '<a aria-label="About Sweet Maid cleaning company"$1>');

  // Header Navigation: Inject "Book Online" into desktop & mobile navs and Header CTA
  newContent = newContent.replace(
    /<a\s+[^>]*href=["'](?:#quote|#lead-form|#contact|https:\/\/sweetmaidcleaning\.com\/#quote|\/#quote)["'][^>]*>[\s\S]*?(?:Get Free Quote|Get a Free Quote|Request a Quote|Free Estimate|Book Now|Instant Booking)[\s\S]*?<\/a>/gi,
    `<a href="/book-online/" class="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-7 py-3 rounded-full font-bold shadow-xl shadow-pink-300/50 hover:shadow-2xl hover:shadow-pink-400/60 hover:scale-105 transition-all flex items-center gap-2" aria-label="Book your cleaning service online"><i class="fa-solid fa-calendar-check text-white"></i> Book Online</a>`
  );
  newContent = newContent.replace(
    /<a\s+href="#quote"([^>]*)>[\s\S]*?Get Free Quote[\s\S]*?<\/a>/gi,
    `<a href="/book-online/" class="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-7 py-3 rounded-full font-bold shadow-xl shadow-pink-300/50 hover:shadow-2xl hover:shadow-pink-400/60 hover:scale-105 transition-all flex items-center gap-2" aria-label="Book your cleaning service online"><i class="fa-solid fa-calendar-check text-white"></i> Book Online</a>`
  );

  if (!newContent.includes('href="/book-online/"')) {
    newContent = newContent.replace(
      /<a([^>]*href="\/gallery\/?"[^>]*)>Gallery<\/a>/gi,
      `<a$1>Gallery</a>\n          <a href="/book-online/" class="text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors">Book Online</a>`
    );
    newContent = newContent.replace(
      /(<a[^>]*href="\/about\/?"[^>]*>[\s\S]*?<\/a>)/i,
      `$1\n        <a href="/book-online/" class="menu-item flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all"><span class="font-bold text-gray-800">Book Online</span><i class="fa-solid fa-calendar-check text-pink-300"></i></a>`
    );
  }

  // Mobile Header Book Online Quick Button
  newContent = newContent.replace(
    /(<button id="mobile-btn"[^>]*>)/i,
    `<a href="/book-online/" class="lg:hidden bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md mr-2 flex items-center gap-1.5 active:scale-95 transition-all"><i class="fa-solid fa-calendar-check text-[11px]"></i> Book Online</a>\n        $1`
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
  newContent = newContent.replace(/src="(?:\.\.\/)+images\//g, 'src="/images/').replace(/url\("(?:\.\.\/)+images\//g, 'url("/images/');
  newContent = newContent.replace(/src="images\//g, 'src="/images/').replace(/url\("images\//g, 'url("/images/');
  newContent = newContent.replace(/src="\/images\/([^"]+)\.jpeg"/gi, 'src="/images/$1.webp"');
  newContent = newContent.replace(/url\(["']?\/images\/([^"')]+)\.jpeg["']?\)/gi, 'url("/images/$1.webp")');

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
  newContent = newContent.replace(/Servicing Florida and surrounding areas/gi, `Servicing ${clean_name} and surrounding areas`);

  // Maps
  const loc_query = encodeURIComponent(`${clean_name}, Florida`);
  const map_url = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${loc_query}+()&t=&z=13&ie=UTF8&iwloc=B&output=embed`;
  newContent = newContent.replace(/https:\/\/maps\.google\.com\/maps\?q=Florida%2C%20FL&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed/gi, map_url);
  newContent = newContent.replace(/https:\/\/www\.google\.com\/maps\/embed\?pb=MAP_PLACEHOLDER/g, map_url);
  newContent = newContent.replace(/https:\/\/maps\.google\.com\/maps\?q=[^&]+&t=&z=13&ie=UTF8&iwloc=&output=embed/g, map_url);
  newContent = newContent.replace(/Servicing entire 34205, 34209, 34208, 34210 areas/g, `Servicing ${clean_name} and surrounding areas`);

  // Aggressive SEO Daily Search Query Matrix
  const seoSection = `
  <section class="py-12 bg-white border-t border-pink-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-8 max-w-3xl mx-auto">
        <h3 class="text-2xl md:text-3xl font-bold text-gray-900 font-serif">${seoPack.dailySearchHeading}</h3>
        <p class="text-gray-600 mt-3 text-sm md:text-base leading-relaxed">${seoPack.searchContextParagraph}</p>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        ${seoPack.dailySearchKeywords.map(tag => '<span class="bg-pink-50 text-pink-600 border border-pink-100 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-pink-100 hover:text-pink-700 transition-colors cursor-default">' + tag + '</span>').join('')}
      </div>
    </div>
  </section>
  `;

  if (newContent.includes('<footer')) {
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
  if (newContent.includes('<footer')) {
    newContent = newContent.replace(/<footer/i, climateSectionHtml + '\n<footer');
  }

  // Inject Structured JSON-LD Schema
  newContent += `\n<script type="application/ld+json">${seoPack.schemaJson}</script>`;

  // Swap out the static generic FAQ accordion block with the SEO-maximized dynamic block
  const staticFaqBlockRegex = /<div class="space-y-4">\s*<!-- Q1 -->[\s\S]*?protect you and your home\.\s*<\/p>\s*<\/details>\s*<\/div>/i;
  newContent = newContent.replace(staticFaqBlockRegex, dynamicFaqHtml);
  const isBradenton = loc_slug === 'bradenton-fl';
  const showLiveElfsight = true;

  // Swap out the static truncated reviews carousel with full, untruncated reviews and working links (or Elfsight widget for Bradenton)
  const reviewsCarouselRegex = /<!-- Reviews Carousel -->[\s\S]*?(?=<!-- Trustindex Badge -->|<!-- Trustindex & Google Reviews Action Links -->)/gi;
  const bradentonElfsightHtml = `<!-- Reviews Carousel -->
      <div class="mt-16">
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
    customH1Inner = `Welcome Back to Sweet Maid Portal in <span class="text-pink-300 font-bold">${clean_name}, FL</span>`;
  } else {
    // service_or_home: Use dynamic zero-duplicate SEO pack H1
    customH1Inner = `${seoPack.h1}`;
  }

  if (customH1Inner) {
    newContent = newContent.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, `<h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-serif drop-shadow-md">${customH1Inner}</h1>`);
  }

  if (miamiBrowardSlugs.includes(loc_slug)) {
    // Replace telephone links
    newContent = newContent.replace(/tel:1?9412222080/gi, 'tel:13058516959');
    newContent = newContent.replace(/tel:941-222-2080/gi, 'tel:305-851-6959');
    
    // Replace telephone display text
    newContent = newContent.replace(/\(?941\)?\s*222\s*-\s*2080/g, '(305) 851-6959');
    newContent = newContent.replace(/9412222080/g, '3058516959');
  }

  return newContent;
}
