const fs = require('fs');
const https = require('https');

const CSV_URL = 'https://raw.githubusercontent.com/kelvins/US-Cities-Database/main/csv/us_cities.csv';
const OUTPUT_PATH = './public/js/city_coords.json';

const req = https.get(CSV_URL, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const lines = body.split('\n');
    const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    
    let addedCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(',');
      if (cols.length < 7) continue;
      
      // ID,CITY,STATE_CODE,STATE_NAME,COUNTY,LATITUDE,LONGITUDE
      const city = cols[1].replace(/"/g, '').trim();
      const stateCode = cols[2].replace(/"/g, '').trim();
      const latStr = cols[5] ? cols[5].replace(/"/g, '') : "0";
      const lngStr = cols[6] ? cols[6].replace(/"/g, '') : "0";
      
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      
      if (stateCode === 'FL') {
        const cleanName = city;
        const slug = cleanName.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-') + '-fl';
          
        if (!existing[slug] && !isNaN(lat) && !isNaN(lng)) {
          existing[slug] = {
            name: cleanName,
            lat: lat,
            lng: lng
          };
          addedCount++;
        }
      }
    }
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2));
    console.log(`Added ${addedCount} new Florida cities! Total cities: ${Object.keys(existing).length}`);
  });
});
req.on('error', console.error);
