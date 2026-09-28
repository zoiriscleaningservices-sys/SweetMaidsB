import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serviceSlugs, resolveAnyLocation, formatName } from '@/lib/data';
import { miamiBrowardSlugs, is305Area } from '@/lib/miami_broward_slugs';
import { getTemplate, extractSections, localizedReplace, serviceH1Map, generatePageImageSchema } from '@/lib/template';
import { generateSeoContentPack } from '@/lib/seo_engine';
import { getLongboatMetadata, getLongboatJsonLd, transformLongboatHtml } from '@/lib/longboat_key_renderer';


export async function generateMetadata({ params }: { params: Promise<{ slug: string, service: string }> }): Promise<Metadata> {
  const { slug, service } = await params;
  if (slug === 'longboat-key-fl') {
    return getLongboatMetadata(service);
  }

  if (!serviceSlugs.includes(service)) return {};

  const locData = resolveAnyLocation(slug);
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  const seoPack = generateSeoContentPack(cleanName, slug, service, service);

  const title = seoPack.metaTitle;
  const desc = seoPack.heroSub.replace(/<[^>]+>/g, '');
  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://www.sweetmaidcleaning.com/${slug}/${service}/`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://www.sweetmaidcleaning.com/${slug}/${service}/`,
      type: 'website',
      images: ['https://i.ibb.co/QSD3Ydt/image.jpg']
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: ['https://i.ibb.co/QSD3Ydt/image.jpg']
    }
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string, service: string }> }) {
  const { slug, service } = await params;

  if (slug === 'longboat-key-fl') {
    if (!serviceSlugs.includes(service)) {
      notFound();
    }

    const rawHtml = getTemplate(service) || getTemplate('house-cleaning');
    if (!rawHtml) {
      notFound();
    }

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, 'Longboat Key', 'longboat-key-fl', true, service);
    const transformedHtml = transformLongboatHtml(localizedHtml, service);
    const schemaStr = getLongboatJsonLd(service);

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaStr }} />
        <div dangerouslySetInnerHTML={{ __html: transformedHtml }} />
      </>
    );
  }

  if (!serviceSlugs.includes(service)) {
    notFound();
  }
  
  const locData = resolveAnyLocation(slug);
  if (!locData) {
    notFound();
  }

  const cleanName = formatName(locData.name);

  const rawHtml = getTemplate(service);
  if (!rawHtml) {
    notFound();
  }

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true, service);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
