import fs from 'fs';
import path from 'path';
import { serviceSlugs, formatName } from './data';

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

  // Safe Text Replacements for H1 without destroying HTML tags
  newContent = newContent.replace(/Best Cleaning Services in/gi, `${serviceName} in`);
  newContent = newContent.replace(/House Cleaning Services in/gi, `${serviceName} in`);
  newContent = newContent.replace(/House Cleaning in/gi, `${serviceName} in`);
  
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

  // Explicitly fix corrupted Home links and logos
  newContent = newContent.replace(/<a href="[^"]+"([^>]*)>Home<\/a>/gi, `<a href="/${loc_slug}/"$1>Home</a>`);
  newContent = newContent.replace(/<a href="[^"]+"([^>]*)class="flex items-center group">/gi, `<a href="/${loc_slug}/"$1class="flex items-center group">`);
  
  newContent = newContent.replace(/href="\/home\/"/g, `href="/${loc_slug}/"`);

  // Fix Cross-City Location Links (e.g. href="/anna-maria-cleaning/")
  newContent = newContent.replace(/href="\/([a-z0-9-]+)-cleaning\/"/g, `href="/$1-fl/${currentService}/"`);

  // Strip native inline onclick to let React ClientInteractions intercept it perfectly
  newContent = newContent.replace(/onclick="this\.parentElement\.classList\.toggle\('accordion-active'\)"/gi, "");

  // Eliminate ONLY the pink button locations grid from the Service Areas section while preserving the Map
  newContent = newContent.replace(/<div class="grid grid-cols-2 md:grid-cols-4 gap-3">[\s\S]*?<\/div>/g, '');

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
          <div class="absolute left-[180px] top-[20px] w-1 h-1 bg-white rounded-full" style="animation: twinkling-long 4s infinite"></div>
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

  // Maps
  const loc_query = encodeURIComponent(`${clean_name}, Florida`);
  const map_url = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${loc_query}+()&t=&z=13&ie=UTF8&iwloc=B&output=embed`;
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

  if (newContent.includes('</footer>')) {
    newContent = newContent.replace('</footer>', seoSection + '\\n</footer>');
  }

  return newContent;
}
