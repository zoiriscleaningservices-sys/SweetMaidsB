import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serviceSlugs, resolveAnyLocation, formatName } from '@/lib/data';
import { miamiBrowardSlugs, is305Area } from '@/lib/miami_broward_slugs';
import { getTemplate, extractSections, localizedReplace, serviceH1Map, generatePageImageSchema } from '@/lib/template';
import { generateSeoContentPack } from '@/lib/seo_engine';
import { getLongboatMetadata, getLongboatJsonLd, transformLongboatHtml } from '@/lib/longboat_key_renderer';


import { resolveFlatCombo } from '@/config/site-structure';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'longboat-key-fl') {
    return getLongboatMetadata('hub');
  }

  const combo = resolveFlatCombo(slug);
  if (combo) {
    if (combo.citySlug === 'longboat-key-fl') {
      return getLongboatMetadata(combo.service);
    }
    const seoPack = generateSeoContentPack(combo.cityName, combo.citySlug, combo.service, combo.service);
    const title = seoPack.metaTitle;
    const desc = seoPack.heroSub.replace(/<[^>]+>/g, '');
    return {
      title,
      description: desc,
      alternates: { canonical: `https://www.sweetmaidcleaning.com/${slug}/` },
      openGraph: { title, description: desc, url: `https://www.sweetmaidcleaning.com/${slug}/`, type: 'website', images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] },
      twitter: { card: 'summary_large_image', title, description: desc, images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] }
    };
  }

  const isService = serviceSlugs.includes(slug);

  if (isService) {
    const seoPack = generateSeoContentPack('Florida', 'fl', slug, slug);
    const title = seoPack.metaTitle;
    const desc = seoPack.heroSub.replace(/<[^>]+>/g, '');
    const keywords = seoPack.dailySearchKeywords.join(', ');

    return {
      title,
      description: desc,
      alternates: { canonical: `https://www.sweetmaidcleaning.com/${slug}/` },
      openGraph: { title, description: desc, url: `https://www.sweetmaidcleaning.com/${slug}/`, type: 'website', images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] },
      twitter: { card: 'summary_large_image', title, description: desc, images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] }
    };
  } else {
    const locData = resolveAnyLocation(slug);
    if (!locData) return {};

    const cleanName = formatName(locData.name);
    const seoPack = generateSeoContentPack(cleanName, slug, 'House Cleaning', 'house-cleaning');
    const title = seoPack.metaTitle;
    const desc = seoPack.heroSub.replace(/<[^>]+>/g, '');

    return {
      title,
      description: desc,
      alternates: { canonical: `https://www.sweetmaidcleaning.com/${slug}/` },
      openGraph: { title, description: desc, url: `https://www.sweetmaidcleaning.com/${slug}/`, type: 'website', images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] },
      twitter: { card: 'summary_large_image', title, description: desc, images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] }
    };
  }
}

export default async function LocationOrServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === 'longboat-key-fl') {
    const rawHtml = getTemplate('house-cleaning');
    if (!rawHtml) notFound();

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, 'Longboat Key', 'longboat-key-fl', false, 'house-cleaning');
    const transformedHtml = transformLongboatHtml(localizedHtml, 'hub');
    const schemaStr = getLongboatJsonLd('hub');

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaStr }} />
        <div dangerouslySetInnerHTML={{ __html: transformedHtml }} />
      </>
    );
  }

  const combo = resolveFlatCombo(slug);
  if (combo) {
    if (combo.citySlug === 'longboat-key-fl') {
      const rawHtml = getTemplate(combo.service) || getTemplate('house-cleaning');
      if (!rawHtml) notFound();
      const bodyContent = extractSections(rawHtml);
      const localizedHtml = localizedReplace(bodyContent, 'Longboat Key', 'longboat-key-fl', true, combo.service);
      const transformedHtml = transformLongboatHtml(localizedHtml, combo.service);
      const schemaStr = getLongboatJsonLd(combo.service);
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaStr }} />
          <div dangerouslySetInnerHTML={{ __html: transformedHtml }} />
        </>
      );
    }

    const rawHtml = getTemplate(combo.service) || getTemplate('house-cleaning');
    if (!rawHtml) notFound();
    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, combo.cityName, combo.citySlug, true, combo.service);
    return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
  }

  const isService = serviceSlugs.includes(slug);

  if (isService) {
    const rawHtml = getTemplate(slug);
    if (!rawHtml) notFound();

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, 'Florida', slug, false, slug);
    return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
  } else {
    const locData = resolveAnyLocation(slug);
    if (!locData) {
      notFound();
    }

    const cleanName = formatName(locData.name);
    const rawHtml = getTemplate('house-cleaning');
    if (!rawHtml) notFound();

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, cleanName, slug, false, 'house-cleaning');
    
    return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
  }
}
