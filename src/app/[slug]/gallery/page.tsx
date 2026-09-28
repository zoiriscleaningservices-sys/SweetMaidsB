import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { resolveAnyLocation, formatName } from '@/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLongboatMetadata, getLongboatJsonLd, transformLongboatHtml } from '@/lib/longboat_key_renderer';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'longboat-key-fl') {
    return getLongboatMetadata('gallery');
  }

  const locData = resolveAnyLocation(slug);
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  let title: string;
  if (cleanName.length <= 8) {
    title = `${cleanName}, FL Cleaning Results & Before/After Gallery | Sweet Maid`;
  } else if (cleanName.length <= 15) {
    title = `${cleanName}, FL Cleaning Results & Photo Gallery | Sweet Maid`;
  } else {
    title = `${cleanName}, FL Cleaning Gallery | Sweet Maid`;
  }
  const desc = `View our spotless results in ${cleanName}, FL! See before and after photos of our professional house cleaning and maid services.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sweetmaidcleaning.com/${slug}/gallery/`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sweetmaidcleaning.com/${slug}/gallery/`,
    }
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === 'longboat-key-fl') {
    const rawHtml = getTemplate('gallery');
    if (!rawHtml) notFound();

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, 'Longboat Key', 'longboat-key-fl', true, 'gallery');
    const transformedHtml = transformLongboatHtml(localizedHtml, 'gallery');
    const schemaStr = getLongboatJsonLd('gallery');

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
  
  const rawHtml = getTemplate('gallery');
  if (!rawHtml) notFound();

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
