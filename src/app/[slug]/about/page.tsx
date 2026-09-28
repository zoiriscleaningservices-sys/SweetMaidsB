import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { resolveAnyLocation, formatName } from '@/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLongboatMetadata, getLongboatJsonLd, transformLongboatHtml } from '@/lib/longboat_key_renderer';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'longboat-key-fl') {
    return getLongboatMetadata('about');
  }

  const locData = resolveAnyLocation(slug);
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  
  // Calibrated to target ~65 characters for optimal Google SERP display
  let title: string;
  if (cleanName.length <= 8) {
    title = `About Sweet Maid: Professional Cleaners & Maid Service in ${cleanName}, FL`;
  } else if (cleanName.length <= 13) {
    title = `${cleanName}, FL Maid Service & House Cleaning Team | Sweet Maid`;
  } else if (cleanName.length <= 18) {
    title = `${cleanName}, FL House Cleaners & Maid Service | Sweet Maid`;
  } else {
    title = `${cleanName}, FL Maid & Cleaning Team | Sweet Maid`;
  }

  const desc = `Family-owned cleaning company in ${cleanName}, FL providing reliable residential and commercial cleaning services.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://www.sweetmaidcleaning.com/${slug}/about/`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://www.sweetmaidcleaning.com/${slug}/about/`,
      siteName: 'Sweet Maid Cleaning Service',
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
  if (slug === 'longboat-key-fl') {
    const rawHtml = getTemplate('about');
    if (!rawHtml) notFound();

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, 'Longboat Key', 'longboat-key-fl', true, 'about');
    const transformedHtml = transformLongboatHtml(localizedHtml, 'about');
    const schemaStr = getLongboatJsonLd('about');

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaStr }} />
        <div dangerouslySetInnerHTML={{ __html: transformedHtml }} />
      </>
    );
  }

  const locData = resolveAnyLocation(slug);

  if (!locData) {
    notFound();
  }

  const cleanName = formatName(locData.name);
  
  const rawHtml = getTemplate('about');
  if (!rawHtml) notFound();

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true, 'about');

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
