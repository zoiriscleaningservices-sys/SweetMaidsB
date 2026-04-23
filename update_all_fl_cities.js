const fs = require('fs');
const cities = require('all-the-cities');
const OUTPUT_PATH = './public/js/city_coords.json';

// all-the-cities contains cities with population > 1000
// country is 'US'. adminCode might map to state code or ID. For US, admin1 is the state code usually, or we can cross-reference 'FL'.
// Wait, adminCode for Florida in geonames is 'FL'
const flCities = cities.filter(city => city.country === 'US' && city.adminCode === 'FL');

const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));

let addedCount = 0;
flCities.forEach(city => {
  const cleanName = city.name;
  const slug = cleanName.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-') + '-fl';
    
  if (!existing[slug]) {
    existing[slug] = {
      name: cleanName,
      lat: city.loc.coordinates[1], // loc.coordinates is [lng, lat]
      lng: city.loc.coordinates[0]
    };
    addedCount++;
  }
});

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2));
console.log(`Added ${addedCount} new Florida cities! Total cities: ${Object.keys(existing).length}`);
