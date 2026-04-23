const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const homePath = path.join(__dirname, 'templates', 'home', 'index.html');
const servicesDir = path.join(__dirname, 'templates', 'services_source');

const homeHtml = fs.readFileSync(homePath, 'utf8');
const $home = cheerio.load(homeHtml);

// 1. Extract Golden Blocks
const goldenHeader = $home('header').prop('outerHTML');
const goldenMobileMenu = $home('#mobile-menu').prop('outerHTML');
const goldenHero = $home('section#home').prop('outerHTML');
const goldenSearch = $home('#global-search-container').closest('section').prop('outerHTML');
const goldenFooter = $home('footer').prop('outerHTML');

if (!goldenHeader || !goldenMobileMenu || !goldenHero || !goldenSearch || !goldenFooter) {
  console.error("Failed to extract one or more golden blocks.");
  process.exit(1);
}

// 2. Iterate and Inject
const services = fs.readdirSync(servicesDir);
let updatedCount = 0;

for (const service of services) {
  const servicePath = path.join(servicesDir, service, 'index.html');
  if (!fs.existsSync(servicePath)) continue;
  
  const serviceHtml = fs.readFileSync(servicePath, 'utf8');
  const $svc = cheerio.load(serviceHtml);
  
  // Replace Header
  $svc('header').replaceWith(goldenHeader);
  
  // Replace Mobile Menu
  $svc('#mobile-menu').replaceWith(goldenMobileMenu);
  
  // Replace Hero
  $svc('section#home').replaceWith(goldenHero);
  
  // Replace Search
  $svc('#global-search-container').closest('section').replaceWith(goldenSearch);
  
  // Replace Footer
  $svc('footer').replaceWith(goldenFooter);
  
  // Fix the "Best Cleaning Services in" text dynamically so we don't permanently embed "Best" if it should say "Deep Cleaning Services in"
  // Wait, template.ts handles this! We just want to inject the raw Golden text. template.ts will do the rest at runtime.
  
  fs.writeFileSync(servicePath, $svc.html());
  updatedCount++;
}

console.log(`Successfully updated ${updatedCount} service templates with the Golden UI!`);
