import fs from 'fs';
import path from 'path';
import { serviceSlugs, formatName } from './data';

// Service to H1 mapping using top-converting transactional SEO search terms
export const serviceH1Map: Record<string, string> = {
  "house-cleaning": "#1 Top-Rated House Cleaning & Professional Maid Services in",
  "deep-cleaning": "#1 Best Deep House Cleaning & Professional Sanitizing in",
  "move-in-out-cleaning": "#1 Top-Rated Move-In & Move-Out House Cleaning Services in",
  "airbnb-cleaning": "#1 Best Airbnb & Vacation Rental Cleaning Services in",
  "commercial-cleaning": "#1 Top-Rated Commercial & Office Cleaning Services in",
  "post-construction-cleaning": "#1 Professional Post-Construction Cleanup Services in",
  "carpet-cleaning": "#1 Top-Rated Professional Carpet & Rug Cleaning Services in",
  "pressure-washing": "#1 Top-Rated Pressure Washing & Exterior House Washing in",
  "window-cleaning": "#1 Best Professional Window Cleaning Services in",
  "home-watch-services": "#1 Top-Rated Home Watch & Property Care Services in",
  "office-janitorial-services": "#1 Best Office Cleaning & Professional Janitorial Services in",
  "janitorial-cleaning-services": "#1 Top-Rated Janitorial & Commercial Cleaning Services in",
  "medical-dental-facility-cleaning": "#1 Best Medical & Dental Facility Cleaning Services in",
  "industrial-warehouse-cleaning": "#1 Top-Rated Industrial & Warehouse Cleaning Services in",
  "floor-stripping-waxing": "#1 Best Floor Stripping & Waxing Services in",
  "gym-fitness-center-cleaning": "#1 Top-Rated Gym & Fitness Center Cleaning Services in",
  "school-daycare-cleaning": "#1 Best School & Daycare Cleaning Services in",
  "church-worship-center-cleaning": "#1 Premium Church & Worship Center Cleaning Services in",
  "property-management-janitorial": "#1 Best Property Management Janitorial & Cleaning Services in",
  "luxury-estate-cleaning": "#1 Top-Rated Luxury Estate & Mansion Cleaning Services in",
  "solar-panel-cleaning": "#1 Best Solar Panel Cleaning & Professional Washing in",
  "gutter-cleaning": "#1 Top-Rated Gutter Cleaning & Downspout Services in",
  "property-maintenance": "#1 Best Property Maintenance & Handyman Services in",
  "airbnb-vacation-rental-management": "#1 Top-Rated Airbnb & Vacation Rental Property Management in",
  "luxury-estate-management": "#1 Best Luxury Estate & Property Management Services in"
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

  // Safe Text Replacements for H1 without destroying HTML tags
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

  // Image Paths
  if (is_sub_page) {
    newContent = newContent.replace(/src="\/images\//g, 'src="/images/').replace(/url\("\/images\//g, 'url("/images/').replace(/url\('\/images\//g, "url('/images/");
    newContent = newContent.replace(/src="images\//g, 'src="/images/').replace(/url\("images\//g, 'url("/images/').replace(/url\('images\//g, "url('/images/");
    newContent = newContent.replace(/src="\.\.\/images\//g, 'src="/images/').replace(/url\("\.\.\/images\//g, 'url("/images/').replace(/url\('\.\.\/images\//g, "url('/images/");
    newContent = newContent.replace(/src="\.\.\/\.\.\/images\//g, 'src="/images/'); // ensure correct absolute path
  } else {
    newContent = newContent.replace(/src="\/images\//g, 'src="/images/').replace(/url\("\/images\//g, 'url("/images/').replace(/url\('\/images\//g, "url('/images/");
    newContent = newContent.replace(/src="images\//g, 'src="/images/').replace(/url\("images\//g, 'url("/images/').replace(/url\('images\//g, "url('/images/");
    newContent = newContent.replace(/src="\.\.\/images\//g, 'src="/images/').replace(/url\("\.\.\/images\//g, 'url("/images/').replace(/url\('\.\.\/images\//g, "url('/images/");
  }

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

  // Aggressive SEO Tag Cloud Injection
  const seoTags = [
    `${serviceName} ${clean_name} FL`,
    `Best ${serviceName} in ${clean_name}`,
    `Top rated ${serviceName.toLowerCase()} near me`,
    `Affordable ${serviceName.toLowerCase()} ${clean_name}`,
    `${clean_name} ${serviceName.toLowerCase()} company`,
    `Professional ${serviceName.toLowerCase()} ${clean_name} Florida`,
    `Reliable ${serviceName.toLowerCase()} experts`
  ];

  const seoSection = `
  <section class="py-12 bg-white border-t border-pink-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-8">
        <h3 class="text-2xl font-bold text-gray-900">Top Local Searches in ${clean_name}</h3>
        <p class="text-gray-500 mt-2">Find the best local services matching your needs</p>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        ${seoTags.map(tag => '<span class="bg-pink-50 text-pink-600 border border-pink-100 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-pink-100 hover:text-pink-700 transition-colors cursor-default">' + tag + '</span>').join('')}
      </div>
    </div>
  </section>
  `;

  if (newContent.includes('<footer')) {
    newContent = newContent.replace(/<footer/i, seoSection + '\n<footer');
  }

  // Dynamic SEO-Maximized FAQs tailored specifically to the Service and Location
  const dynamicFaqHtml = `<div class="space-y-4">
        <!-- Q1 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            Who provides the best ${serviceName.toLowerCase()} in ${clean_name}, FL?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Sweet Maid is widely recognized as the #1 top-rated provider for <strong>${serviceName.toLowerCase()} in ${clean_name}, Florida</strong>. Our expert team delivers highly affordable, meticulous, and professional ${serviceName.toLowerCase()} perfectly tailored for both residential and commercial properties in ${clean_name}. We stand by our work with a 100% satisfaction guarantee.
          </p>
        </details>

        <!-- Q2 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            How much does professional ${serviceName.toLowerCase()} cost near me in ${clean_name}?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            The cost for affordable ${serviceName.toLowerCase()} in ${clean_name} varies depending on your specific needs, the size of your property, and the frequency of the service. Sweet Maid offers highly competitive and transparent pricing for expert ${serviceName.toLowerCase()} in ${clean_name}, FL. Contact us today for a fast, free local estimate!
          </p>
        </details>

        <!-- Q3 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            Are there reliable ${serviceName.toLowerCase()} experts in ${clean_name}?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Yes! Sweet Maid employs the most reliable and highly-trained local experts for ${serviceName.toLowerCase()} in the ${clean_name} area. We specialize in comprehensive, eco-friendly ${serviceName.toLowerCase()} solutions tailored specifically for homes and businesses in ${clean_name}, Florida. All of our cleaners are fully vetted, insured, and bonded.
          </p>
        </details>
        
        <!-- Q4 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            What is included in your ${serviceName.toLowerCase()} in ${clean_name}?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Our premium ${serviceName.toLowerCase()} in ${clean_name} includes a comprehensive, top-to-bottom approach. Depending on the exact package you choose, we cover everything from deep scrubbing and sanitization to dusting and polishing. Sweet Maid ensures every corner of your ${clean_name} property receives the highest standard of care.
          </p>
        </details>

        <!-- Q5 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            Do you use eco-friendly products for ${serviceName.toLowerCase()} in ${clean_name}, FL?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Absolutely. Sweet Maid prioritizes your health and safety by using premium, eco-friendly, and pet-safe cleaning products for all our ${serviceName.toLowerCase()} across ${clean_name}, Florida. We deliver a spotless shine without the use of harsh or dangerous chemicals.
          </p>
        </details>

        <!-- Q6 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            Can I schedule recurring ${serviceName.toLowerCase()} in ${clean_name}?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Yes, we offer highly flexible scheduling for ${serviceName.toLowerCase()} in ${clean_name}. Whether you need weekly, bi-weekly, or monthly maintenance, Sweet Maid can customize a recurring schedule that perfectly fits your lifestyle and ensures your ${clean_name} home or office stays impeccably clean.
          </p>
        </details>

        <!-- Q7 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            Do I need to provide supplies for my ${serviceName.toLowerCase()} in ${clean_name}?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            No, you do not need to lift a finger! The Sweet Maid team arrives at your ${clean_name} property fully equipped with industry-leading tools and professional-grade supplies necessary to complete your ${serviceName.toLowerCase()} to absolute perfection.
          </p>
        </details>

        <!-- Q8 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            How do I book ${serviceName.toLowerCase()} in ${clean_name}, Florida?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Booking your ${serviceName.toLowerCase()} in ${clean_name} is incredibly easy. You can call our local ${clean_name} office directly, or use our instant online booking platform to secure your preferred date and time for premium ${serviceName.toLowerCase()}.
          </p>
        </details>

        <!-- Q9 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            Is Sweet Maid insured and bonded for ${serviceName.toLowerCase()} in ${clean_name}?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Yes, providing peace of mind is our top priority. Sweet Maid is fully licensed, insured, and bonded to perform ${serviceName.toLowerCase()} throughout ${clean_name}, FL. Your property is entirely protected while our specialists are on-site.
          </p>
        </details>

        <!-- Q10 -->
        <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
          <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
            Why choose Sweet Maid for ${serviceName.toLowerCase()} in ${clean_name} over competitors?
            <span class="transition duration-300 group-open:-rotate-180">
              <i class="fa-solid fa-chevron-down text-pink-300"></i>
            </span>
          </summary>
          <p class="mt-4 text-gray-600 leading-relaxed">
            Sweet Maid outshines the competition by offering unmatched reliability, crystal-clear communication, and elite-level ${serviceName.toLowerCase()} in ${clean_name}. Our dedication to perfection, localized expertise in Florida, and strictly vetted staff make us the undisputed choice for ${serviceName.toLowerCase()}.
          </p>
        </details>
      </div>`;

  // Swap out the static generic FAQ accordion block with the SEO-maximized dynamic block
  const staticFaqBlockRegex = /<div class="space-y-4">\s*<!-- Q1 -->[\s\S]*?protect you and your home\.\s*<\/p>\s*<\/details>\s*<\/div>/i;
  newContent = newContent.replace(staticFaqBlockRegex, dynamicFaqHtml);
  const isBradenton = loc_slug === 'bradenton-fl';

  // Swap out the static truncated reviews carousel with full, untruncated reviews and working links (or Elfsight widget for Bradenton)
  const reviewsCarouselRegex = /<!-- Reviews Carousel -->[\s\S]*?(?=<!-- Trustindex Badge -->|<!-- Trustindex & Google Reviews Action Links -->)/gi;
  const bradentonElfsightHtml = `<!-- Reviews Carousel -->
      <div class="mt-16">
        <div class="elfsight-app-155f35e3-448d-4bc2-b8c4-fc9011f6424c" data-elfsight-app-lazy></div>
      </div>
      
      `;
  const fullReviewsCarouselHtml = isBradenton ? bradentonElfsightHtml : `<!-- Reviews Carousel -->
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
  const realTimeReviewsHtml = isBradenton ? `<!-- Elfsight Google Reviews Widget Loaded -->` : `<!-- Trustindex & Google Reviews Action Links -->
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

  // 2. High-converting H1 Domination Injection
  let customH1Inner = '';
  if (pageType === 'about') {
    customH1Inner = `#1 Top-Rated House Cleaning & Maid Service Team in <span class="text-pink-500 font-bold">${clean_name}, FL</span>`;
  } else if (pageType === 'gallery') {
    customH1Inner = `#1 Best Cleaning Results & Professional Service Gallery in <span class="text-pink-500 font-bold">${clean_name}, FL</span>`;
  } else if (pageType === 'blog') {
    customH1Inner = `#1 Best Cleaning Tips & Professional Home Care Blog in <span class="text-pink-500 font-bold">${clean_name}, FL</span>`;
  } else if (pageType === 'login') {
    customH1Inner = `Welcome Back to Sweet Maid - #1 Rated Cleaning Portal in <span class="text-pink-500 font-bold">${clean_name}, FL</span>`;
  } else {
    // service_or_home
    const isService = serviceSlugs.includes(currentService);
    if (isService) {
      const targetH1Prefix = serviceH1Map[currentService] || "#1 Top-Rated House Cleaning & Professional Maid Services in";
      customH1Inner = `${targetH1Prefix} <br class="hidden sm:block"> <span class="text-pink-300 drop-shadow-md">${clean_name}, FL</span>`;
    } else {
      // Home / Location Homepage
      customH1Inner = `#1 Rated House Cleaning & Professional Maid Services in <br class="hidden sm:block"> <span class="text-pink-300 drop-shadow-md">${clean_name}, FL</span>`;
    }
  }

  if (customH1Inner && originalH1Match) {
    newContent = newContent.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (match) => {
      const openingTagMatch = match.match(/^(<h1[^>]*>)/i);
      if (openingTagMatch) {
        return `${openingTagMatch[1]}${customH1Inner}</h1>`;
      }
      return match;
    });
  }

  return newContent;
}
