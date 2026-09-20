import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';
import { Metadata } from 'next';

const title = 'Florida Cleaning Blog & Statewide Home Care Guides | Sweet Maid';
const desc = 'Expert Florida house cleaning tips, vacation rental turnover checklists, and coastal home care guides for Tampa Bay, Miami, Orlando, Sarasota, Bradenton, Jacksonville & the Florida Keys.';

export const metadata: Metadata = {
  title,
  description: desc,
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
    title,
    description: desc,
    url: 'https://sweetmaidcleaning.com/blog/',
    siteName: 'Sweet Maid Cleaning Services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: desc,
  }
};

export default function BlogRoot() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  const rawHtml = getTemplate('blog');
  if (!rawHtml) return <div>Blog template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, true, 'blog');

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
