import { Metadata } from 'next';
import { serviceSlugs, getLocationData, formatName } from '@/lib/data';
import { getTemplate, extractSections, localizedReplace } from '@/lib/template';

export async function generateStaticParams() {
  const data = getLocationData();
  const slugs = Object.keys(data);
  const params: { slug: string }[] = [];

  slugs.forEach((slug) => {
    params.push({ slug });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const isService = serviceSlugs.includes(slug);

  if (isService) {
    const serviceName = formatName(slug.replace(/-/g, ' '));
    const title = `Top ${serviceName} in Bradenton, FL | Sweet Maid`;
    const desc = `Affordable and highly rated ${serviceName} in Bradenton, FL. Sweet Maid provides trusted professional cleaners for your property. Get a free quote today!`;
    return {
      title,
      description: desc,
      alternates: { canonical: `https://sweetmaidcleaning.com/${slug}/` },
      openGraph: { title, description: desc, url: `https://sweetmaidcleaning.com/${slug}/` }
    };
  } else {
    const data = getLocationData();
    const locData = data[slug];
    if (!locData) return {};

    const cleanName = formatName(locData.name);
    const title = `Best House Cleaning Services in ${cleanName}, FL | Top Rated & Reliable`;
    const desc = `Looking for the best house cleaning in ${cleanName}? Sweet Maid provides top-rated, reliable, and affordable maid services. 100% Satisfaction Guaranteed.`;

    return {
      title,
      description: desc,
      alternates: { canonical: `https://sweetmaidcleaning.com/${slug}/` },
      openGraph: { title, description: desc, url: `https://sweetmaidcleaning.com/${slug}/` }
    };
  }
}

export default async function LocationOrServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isService = serviceSlugs.includes(slug);

  if (isService) {
    const rawHtml = getTemplate(slug);
    if (!rawHtml) return <div>Service template missing</div>;

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, 'Bradenton', slug, false);
    return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
  } else {
    const data = getLocationData();
    const locData = data[slug];
    if (!locData) return <div>Location not found</div>;

    const cleanName = formatName(locData.name);
    const rawHtml = getTemplate('house-cleaning');
    if (!rawHtml) return <div>Template missing</div>;

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, cleanName, slug, false);
    return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
  }
}
