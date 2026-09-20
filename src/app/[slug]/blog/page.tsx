import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { getLocationData, formatName } from '@/lib/data';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  const title = `${cleanName}, FL Cleaning Blog & Regional Florida Home Care Guides | Sweet Maid`;
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
    }
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getLocationData();
  const locData = data[slug];

  if (!locData) {
    return <div>Location not found</div>;
  }

  const cleanName = formatName(locData.name);
  
  const rawHtml = getTemplate('blog');
  if (!rawHtml) return <div>Blog template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
