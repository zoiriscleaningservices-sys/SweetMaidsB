import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';
import { Metadata } from 'next';

const title = 'About Sweet Maid: Trusted Florida House Cleaning & Maid Service';
const desc = 'Built on family-owned values, Sweet Maid has cleaned over 5,000 houses, offices, move-out cleans, and post-construction jobs across Florida with 5-star care.';

export const metadata: Metadata = {
  title,
  description: desc,
  keywords: [
    'about Sweet Maid',
    'Florida house cleaning company',
    'family owned maid service Florida',
    'office cleaning Florida',
    'post construction cleaning Florida',
    'move out cleaners Florida'
  ],
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/about/',
  },
  openGraph: {
    title,
    description: desc,
    url: 'https://sweetmaidcleaning.com/about/',
    siteName: 'Sweet Maid Cleaning Services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: desc,
  }
};

export default function AboutRoot() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  const rawHtml = getTemplate('about');
  if (!rawHtml) return <div>About template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, true, 'about');

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
