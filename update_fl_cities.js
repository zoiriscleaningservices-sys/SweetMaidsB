const fs = require('fs');
const https = require('https');

const GIST_URL = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const OUTPUT_PATH = './public/js/city_coords.json';

https.get(GIST_URL, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const allCities = JSON.parse(body);
    const flCities = allCities.filter(c => c.state === 'Florida');
    
    // Read existing
    let existing = {};
    if (fs.existsSync(OUTPUT_PATH)) {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    }
    
    // Merge
    let count = 0;
    flCities.forEach(city => {
      // clean name for slug: "St. Petersburg" -> "st-petersburg"
      const slug = city.city.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-') + '-fl';
        
      if (!existing[slug]) {
        existing[slug] = {
          name: city.city,
          lat: city.latitude,
          lng: city.longitude
        };
        count++;
      }
    });
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2));
    console.log(`Added ${count} new Florida cities. Total is now ${Object.keys(existing).length}`);
  });
}).on('error', (e) => {
  console.error(e);
});
