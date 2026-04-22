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
  const bodyStart = html.indexOf('<body class="antialiased">');
  const bodyEnd = html.indexOf('</body>');
  
  if (bodyStart !== -1 && bodyEnd !== -1) {
    return html.substring(bodyStart + 26, bodyEnd).trim();
  }
  
  return html;
}

export function exportHead(html: string) {
  const match = html.match(/<head[\s\S]*?>([\s\S]*?)<\/head>/i);
  return match ? match[1] : '';
}

export function localizedReplace(content: string, clean_name: string, loc_slug: string, is_sub_page = false) {
  if (!content) return '';
  
  let newContent = content;
  newContent = newContent.replace(/Bradenton’s/g, `${clean_name}'s`).replace(/Bradenton's/g, `${clean_name}'s`);
  newContent = newContent.replace(/across Bradenton and Southwest Florida/g, `across ${clean_name} and Southwest Florida`);
  newContent = newContent.replace(/in Bradenton home/g, `in ${clean_name} home`);
  newContent = newContent.replace(/Favorite Cleaners in Bradenton/g, `Favorite Cleaners in ${clean_name}`);
  newContent = newContent.replace(/Top Rated in Bradenton/g, `Top Rated in ${clean_name}`);
  newContent = newContent.replace(/Cleaning Service in Bradenton/g, `Cleaning Service in ${clean_name}`);
  newContent = newContent.replace(/house cleaning Bradenton/g, `house cleaning ${clean_name}`);
  newContent = newContent.replace(/maid service Bradenton/g, `maid service ${clean_name}`);
  newContent = newContent.replace(/Bradenton, FL/g, `${clean_name}, FL`);
  newContent = newContent.replace(/Bradenton/g, clean_name);
  
  // Navigation Links
  for (const s_slug of serviceSlugs) {
    newContent = newContent.replace(new RegExp(`href="/${s_slug}/"`, 'g'), `href="/${loc_slug}/${s_slug}/"`);
    newContent = newContent.replace(new RegExp(`href="https://sweetmaidcleaning.com/${s_slug}/"`, 'g'), `href="https://sweetmaidcleaning.com/${loc_slug}/${s_slug}/"`);
  }
  
  newContent = newContent.replace(/href="\/home\/"/g, `href="/${loc_slug}/"`);
  newContent = newContent.replace(/href="\/about\/"/g, `href="/${loc_slug}/about/"`);
  newContent = newContent.replace(/href="\/gallery\/"/g, `href="/${loc_slug}/gallery/"`);

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

  return newContent;
}
