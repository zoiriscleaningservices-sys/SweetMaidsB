import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { getLocationData, formatName, serviceSlugs } from '@/lib/data';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const data = getLocationData();
  const locationParams = Object.keys(data).map((loc) => ({ slug: loc }));
  const serviceParams = serviceSlugs.map((s) => ({ slug: s }));
  
  return [...locationParams, ...serviceParams];
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

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isService = serviceSlugs.includes(slug);

  if (isService) {
    const cleanName = formatName('Bradenton');
    const rawHtml = getTemplate(slug);
    if (!rawHtml) return <div>Service template missing</div>;

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, cleanName, 'bradenton-fl', true);
    return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
  } else {
    const data = getLocationData();
    const locData = data[slug];
    if (!locData) return <div>Location not found</div>;

    const cleanName = formatName(locData.name);
    const rawHtml = getTemplate('home');
    if (!rawHtml) return <div>Template missing</div>;

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, cleanName, slug, false);
    return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
  }
}
