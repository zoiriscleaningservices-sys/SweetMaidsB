import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '#1 Best Cleaning Results & Professional Service Gallery in Bradenton, FL',
  description: 'View our spotless results in Bradenton, FL! See before and after photos of our professional house cleaning and maid services.',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/gallery/',
  },
  openGraph: {
    title: '#1 Best Cleaning Results & Professional Service Gallery in Bradenton, FL',
    description: 'View our spotless results in Bradenton, FL! See before and after photos of our professional house cleaning and maid services.',
    url: 'https://sweetmaidcleaning.com/gallery/',
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
