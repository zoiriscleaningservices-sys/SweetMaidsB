import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { REGIONS, CITY_PAGES } from '../src/config/site-structure';

interface SearchCityItem {
  id: number;
  name: string;
  county: string;
  region: string;
  ready: boolean;
  dest: string;
  outcome: 'a' | 'b' | 'c' | 'd';
  aliases?: string[];
}

export function buildSearchIndex() {
  const geoMasterPath = path.join(process.cwd(), 'public', 'js', 'florida_geo_master.json');
  if (!fs.existsSync(geoMasterPath)) {
    throw new Error('florida_geo_master.json not found');
  }

  const geoMaster = JSON.parse(fs.readFileSync(geoMasterPath, 'utf8'));
  const citiesDb = geoMaster.cities || {};
  const zipsDb = geoMaster.zip_codes || {};

  // Build lookup for zip -> county & city
  const zipToCity: Record<string, string> = {};
  const cityToCountyFromZip: Record<string, string> = {};

  for (const [zipKey, z] of Object.entries(zipsDb) as [string, any][]) {
    const zipCode = z.zip || zipKey;
    const cityName = z.city;
    if (zipCode && cityName) {
      zipToCity[zipCode] = cityName;
      if (z.county && !cityToCountyFromZip[cityName.toLowerCase()]) {
        cityToCountyFromZip[cityName.toLowerCase()] = z.county;
      }
    }
  }

  // Predefined aliases
  const aliasMapping: Record<string, string[]> = {
    'St. Petersburg': ['st pete', 'st. petersburg', 'saint petersburg', 'st petersburg', 'saint pete'],
    'Lakewood Ranch': ['lwr', 'lakewood'],
    'Fort Lauderdale': ['ft lauderdale', 'ft. lauderdale', 'fort lauderdale'],
    'Fort Myers': ['ft myers', 'ft. myers', 'fort myers'],
    'Fish Hawk': ['lithia', 'fishhawk'],
    'Panama City Beach': ['pcb', 'panama beach'],
    'Fernandina Beach': ['amelia', 'amelia island', 'fernandina'],
    'Jacksonville': ['jax', 'duval'],
    'Jacksonville Beach': ['jax beach', 'jax bch'],
    'St. Augustine': ['saint augustine', 'st augustine', 'st. augustine'],
    'St. Augustine Beach': ['saint augustine beach', 'st augustine beach'],
    'Ponte Vedra Beach': ['ponte vedra', 'pvb', 'nocatee'],
    'Key Largo': ['key largo', 'key-largo', 'north key largo'],
    'Key West': ['key west', 'key-west'],
    'Siesta Key': ['siesta'],
    'Longboat Key': ['longboat'],
    'Miami Beach': ['miami bch', 'south beach', 'sobe'],
    'Bradenton': ['bradneton', 'manatee'],
    'Sarasota': ['sarasoto']
  };

  const cityItems: SearchCityItem[] = [];
  const processedNames = new Set<string>();

  // Process all cities in CITY_PAGES first
  for (const [slug, cp] of Object.entries(CITY_PAGES)) {
    const name = cp.name;
    const lowerName = name.toLowerCase();
    processedNames.add(lowerName);

    // Find region
    let regionName = cp.county;
    let isReady = true;

    for (const [rKey, reg] of Object.entries(REGIONS)) {
      if (reg.placesServed.some(p => p.toLowerCase() === lowerName) || reg.county.toLowerCase() === cp.county.toLowerCase()) {
        regionName = reg.name;
        isReady = reg.ready;
        break;
      }
    }

    const aliases = aliasMapping[name] || [];

    cityItems.push({
      id: cityItems.length,
      name,
      county: cp.county,
      region: regionName,
      ready: true, // Has own page
      dest: `/${slug}/`,
      outcome: 'a',
      aliases: aliases.length > 0 ? aliases : undefined
    });
  }

  // Process other cities from REGIONS.placesServed
  for (const [rKey, reg] of Object.entries(REGIONS)) {
    for (const place of reg.placesServed) {
      if (processedNames.has(place.toLowerCase())) continue;
      processedNames.add(place.toLowerCase());

      const aliases = aliasMapping[place] || [];
      const isReady = reg.ready;
      const hubSlug = reg.slug ? `/${reg.slug}/` : '/locations/';
      const dest = isReady ? `${hubSlug}#areas-we-serve` : `/locations/?q=${encodeURIComponent(place)}`;
      const outcome = isReady ? 'b' : 'c';

      cityItems.push({
        id: cityItems.length,
        name: place,
        county: reg.county,
        region: reg.name,
        ready: isReady,
        dest,
        outcome,
        aliases: aliases.length > 0 ? aliases : undefined
      });
    }
  }

  // Process all remaining cities from florida_geo_master.json
  for (const [slug, c] of Object.entries(citiesDb) as [string, any][]) {
    const name = c.name;
    if (!name || processedNames.has(name.toLowerCase())) continue;
    processedNames.add(name.toLowerCase());

    const lowerName = name.toLowerCase();
    let county = cityToCountyFromZip[lowerName] || 'Florida';
    let regionName = 'Florida';
    let isReady = false;
    let dest = `/locations/?q=${encodeURIComponent(name)}`;
    let outcome: 'a' | 'b' | 'c' = 'c';

    // Check if place belongs to any region
    for (const [rKey, reg] of Object.entries(REGIONS)) {
      if (reg.placesServed.some(p => p.toLowerCase() === lowerName)) {
        regionName = reg.name;
        county = reg.county;
        isReady = reg.ready;
        if (isReady) {
          dest = `/${reg.slug}/#areas-we-serve`;
          outcome = 'b';
        }
        break;
      }
    }

    const aliases = aliasMapping[name] || [];

    cityItems.push({
      id: cityItems.length,
      name,
      county,
      region: regionName,
      ready: isReady,
      dest,
      outcome,
      aliases: aliases.length > 0 ? aliases : undefined
    });
  }

  // Compact index representation to minimize payload
  const compactIndex = {
    cities: cityItems.map(c => [
      c.name,
      c.county.replace(/\s*County/i, ''),
      c.dest,
      c.outcome,
      c.ready ? 1 : 0,
      c.aliases ? c.aliases.join('|') : ''
    ]),
    zips: zipToCity
  };

  const outputDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'city_search_index.json');
  const jsonStr = JSON.stringify(compactIndex);
  fs.writeFileSync(outputPath, jsonStr, 'utf8');

  const rawBytes = Buffer.byteLength(jsonStr, 'utf8');
  const gzippedBytes = zlib.gzipSync(jsonStr).length;

  console.log(`✅ City search index built successfully:`);
  console.log(`   Total cities indexed: ${cityItems.length}`);
  console.log(`   Total ZIPs indexed: ${Object.keys(zipToCity).length}`);
  console.log(`   Raw JSON size: ${(rawBytes / 1024).toFixed(1)} KB`);
  console.log(`   Gzipped size: ${(gzippedBytes / 1024).toFixed(1)} KB (Budget: < 80 KB)`);

  return { rawBytes, gzippedBytes, totalCities: cityItems.length };
}

if (require.main === module) {
  buildSearchIndex();
}
