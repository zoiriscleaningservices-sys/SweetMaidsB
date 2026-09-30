import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cleaning Results & Before/After Photo Gallery | Sweet Maid',
  description: 'View real cleaning results and before-and-after photos by Sweet Maid Cleaning Service. Spotless kitchens, bathrooms, floors, and seasonal resets across Florida.',
  alternates: {
    canonical: 'https://www.sweetmaidcleaning.com/gallery/',
  },
  openGraph: {
    title: 'Cleaning Results & Before/After Photo Gallery | Sweet Maid',
    description: 'View real cleaning results and before-and-after photos by Sweet Maid Cleaning Service. Spotless kitchens, bathrooms, floors, and seasonal resets across Florida.',
    url: 'https://www.sweetmaidcleaning.com/gallery/',
  }
};

export default function GalleryRoot() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  const rawHtml = getTemplate('gallery');
  if (!rawHtml) return <div>Gallery template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
