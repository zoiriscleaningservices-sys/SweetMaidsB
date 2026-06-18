import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '#1 Top-Rated House Cleaning & Maid Service Team in Bradenton, FL',
  description: 'Learn more about Sweet Maid, the leading provider of residential and commercial cleaning services. We are committed to your total satisfaction.',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/about/',
  },
  openGraph: {
    title: '#1 Top-Rated House Cleaning & Maid Service Team in Bradenton, FL',
    description: 'Learn more about Sweet Maid, the leading provider of residential and commercial cleaning services. We are committed to your total satisfaction.',
    url: 'https://sweetmaidcleaning.com/about/',
  }
};

export default function AboutRoot() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  const rawHtml = getTemplate('about');
  if (!rawHtml) return <div>About template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
