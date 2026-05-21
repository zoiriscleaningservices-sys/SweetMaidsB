import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { getLocationData, formatName } from '@/lib/data';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  const title = `#1 Cleaning Tips & Professional Home Care Blog in ${cleanName}, FL | Sweet Maid`;
  const desc = `Get expert cleaning tips, home organization hacks, and professional maid advice for your home in ${cleanName}, FL from the team at Sweet Maid.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sweetmaidcleaning.com/${slug}/blog/`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sweetmaidcleaning.com/${slug}/blog/`,
    }
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getLocationData();
  const locData = data[slug];

  if (!locData) {
    return <div>Location not found</div>;
  }

  const cleanName = formatName(locData.name);
  
  const rawHtml = getTemplate('blog');
  if (!rawHtml) return <div>Blog template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
