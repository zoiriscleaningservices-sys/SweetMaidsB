import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { getLocationData, formatName } from '@/lib/data';
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  
  // Calibrated to target ~65 characters for optimal Google SERP display
  let title: string;
  if (cleanName.length <= 8) {
    title = `About Sweet Maid: Top Cleaners & Maid Service in ${cleanName}, FL`;
  } else if (cleanName.length <= 13) {
    title = `${cleanName}, FL Maid Service & House Cleaning Team | Sweet Maid`;
  } else if (cleanName.length <= 18) {
    title = `${cleanName}, FL House Cleaners & Maid Service | Sweet Maid`;
  } else {
    title = `${cleanName}, FL Maid & Cleaning Team | Sweet Maid`;
  }

  const desc = `Family-owned cleaning company in ${cleanName}, FL. Over 5,000 houses, corporate offices, move-out cleans, and post-construction jobs completed with 5-star care.`;

  return {
    title,
    description: desc,
    keywords: [
      `about Sweet Maid ${cleanName}`,
      `maid service ${cleanName} FL`,
      `house cleaning company ${cleanName}`,
      `family owned cleaners ${cleanName} FL`,
      `post construction cleaning ${cleanName}`,
      `move out cleaning ${cleanName}`
    ],
    alternates: {
      canonical: `https://sweetmaidcleaning.com/${slug}/about/`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sweetmaidcleaning.com/${slug}/about/`,
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

export default async function AboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getLocationData();
  const locData = data[slug];

  if (!locData) {
    return <div>Location not found</div>;
  }

  const cleanName = formatName(locData.name);
  
  const rawHtml = getTemplate('about');
  if (!rawHtml) return <div>About template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true, 'about');

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
