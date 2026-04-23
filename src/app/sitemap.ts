import { MetadataRoute } from 'next';
import { serviceSlugs, getLocationSlugs } from '@/lib/data';

const BASE_URL = 'https://www.sweetmaidcleaning.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locations = getLocationSlugs();
  
  const urls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  locations.forEach((location) => {
    // Location Hub Page
    urls.push({
      url: `${BASE_URL}/${location}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    // Service Area Pages
    serviceSlugs.forEach((service) => {
      urls.push({
        url: `${BASE_URL}/${location}/${service}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return urls;
}
