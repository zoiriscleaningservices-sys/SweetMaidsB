import { Metadata } from 'next';
import { serviceSlugs, getLocationData, formatName } from '@/lib/data';
import { getTemplate, extractSections, localizedReplace } from '@/lib/template';

export async function generateStaticParams() {
  const data = getLocationData();
  const slugs = Object.keys(data);
  const params: { slug: string; service: string }[] = [];

  slugs.forEach((slug) => {
    serviceSlugs.forEach((service) => {
      params.push({ slug, service });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, service: string }> }): Promise<Metadata> {
  const { slug, service } = await params;
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  const serviceName = formatName(service.replace(/-/g, ' '));
  
  const title = `Top ${serviceName} in ${cleanName}, FL | Sweet Maid`;
  const desc = `Affordable and highly rated ${serviceName} in ${cleanName}, FL. Sweet Maid provides trusted professional cleaners for your property. Get a free quote today!`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sweetmaidcleaning.com/${slug}/${service}/`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sweetmaidcleaning.com/${slug}/${service}/`,
    }
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string, service: string }> }) {
  const { slug, service } = await params;
  
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return <div>Location not found</div>;

  const cleanName = formatName(locData.name);

  const rawHtml = getTemplate(service);
  if (!rawHtml) return <div>Service template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true, service);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
