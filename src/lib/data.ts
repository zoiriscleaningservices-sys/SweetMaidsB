import fs from 'fs';
import path from 'path';

export const serviceSlugs = [
  "house-cleaning", "deep-cleaning", "move-in-out-cleaning", "airbnb-cleaning", "commercial-cleaning",
  "post-construction-cleaning", "carpet-cleaning", "pressure-washing", "window-cleaning",
  "home-watch-services", "office-janitorial-services", "janitorial-cleaning-services",
  "medical-dental-facility-cleaning", "industrial-warehouse-cleaning", "floor-stripping-waxing",
  "gym-fitness-center-cleaning", "school-daycare-cleaning", "church-worship-center-cleaning",
  "property-management-janitorial", "luxury-estate-cleaning", "solar-panel-cleaning",
  "gutter-cleaning", "property-maintenance", "airbnb-vacation-rental-management",
  "luxury-estate-management"
];

export function getLocationData() {
  const filePath = path.join(process.cwd(), 'public', 'js', 'city_coords.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getLocationSlugs() {
  const data = getLocationData();
  return Object.keys(data);
}

export function formatName(name: string) {
  return name.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
