import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { resolveAnyLocation, formatName } from '@/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locData = resolveAnyLocation(slug);
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  
  // Calibrated to target ~65 characters for optimal Google SERP snippet display
  let title: string;
  if (cleanName.length <= 12) {
    title = `${cleanName}, FL Cleaning Blog & Home Care Guides | Sweet Maid`;
  } else if (cleanName.length <= 18) {
    title = `${cleanName}, FL Cleaning Blog & Maid Guides | Sweet Maid`;
  } else {
    title = `${cleanName}, FL Cleaning Blog | Sweet Maid`;
  }
  
  const desc = `Expert cleaning tips, vacation rental turnover checklists, and coastal home maintenance guides for ${cleanName}, FL and major Florida regions including Tampa Bay, Miami, Orlando, Sarasota, and the Keys.`;

  return {
    title,
    description: desc,
    keywords: [
      `${cleanName} cleaning blog`,
      `${cleanName} house cleaning tips`,
      `maid service advice ${cleanName} FL`,
      'Florida cleaning blog',
      'vacation rental turnover checklist',
      'coastal Florida home care'
    ],
    alternates: {
      canonical: `https://sweetmaidcleaning.com/${slug}/blog/`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sweetmaidcleaning.com/${slug}/blog/`,
      siteName: 'Sweet Maid Cleaning Services',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
    }
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locData = resolveAnyLocation(slug);

  if (!locData) {
    notFound();
  }

  const cleanName = formatName(locData.name);
  
  const rawHtml = getTemplate('blog');
  if (!rawHtml) notFound();

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true, 'blog');

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
