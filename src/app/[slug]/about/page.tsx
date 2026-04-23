import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { getLocationData, formatName } from '@/lib/data';
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  const title = `About Sweet Maid in ${cleanName}, FL | Trusted House Cleaners`;
  const desc = `Learn more about Sweet Maid, the leading provider of residential and commercial cleaning services in ${cleanName}, FL. We are committed to your total satisfaction.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sweetmaidcleaning.com/${slug}/about/`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sweetmaidcleaning.com/${slug}/about/`,
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
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
