import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { getLocationData, formatName } from '@/lib/data';
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  const title = `#1 Best Cleaning Results & Professional Service Gallery in ${cleanName}, FL`;
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
  const data = getLocationData();
  const locData = data[slug];

  if (!locData) {
    return <div>Location not found</div>;
  }

  const cleanName = formatName(locData.name);
  
  const rawHtml = getTemplate('gallery');
  if (!rawHtml) return <div>Gallery template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
