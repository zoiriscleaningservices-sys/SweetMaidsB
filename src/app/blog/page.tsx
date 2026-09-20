import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Florida Cleaning Blog & Home Care Guides | Tampa, Miami, Orlando, Sarasota, Jax & Keys',
  description: 'Expert Florida house cleaning tips, vacation rental turnover checklists, and coastal home care guides for Tampa Bay, Miami, Orlando, Sarasota, Bradenton, Jacksonville & the Florida Keys.',
  keywords: [
    'Florida cleaning blog',
    'house cleaning tips Florida',
    'Tampa Bay cleaning guides',
    'Miami vacation rental turnover',
    'Orlando Airbnb cleaning checklist',
    'Sarasota Bradenton maid service tips',
    'Jacksonville home cleaning',
    'Florida Keys coastal home care',
    'deep cleaning tips Florida'
  ],
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/blog/',
  },
  openGraph: {
    title: 'Florida Cleaning Blog & Home Care Guides | Sweet Maid',
    description: 'Expert Florida house cleaning tips, vacation rental turnover checklists, and coastal home care guides across Tampa Bay, Miami, Orlando, Sarasota, Jacksonville & the Florida Keys.',
    url: 'https://sweetmaidcleaning.com/blog/',
    siteName: 'Sweet Maid Cleaning Services',
    type: 'website',
  }
};

export default function BlogRoot() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  const rawHtml = getTemplate('blog');
  if (!rawHtml) return <div>Blog template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
