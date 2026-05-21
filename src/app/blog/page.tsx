import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '#1 Cleaning Tips & Professional Home Care Blog | Sweet Maid',
  description: 'Get expert cleaning tips, home organization hacks, and professional maid advice from the team at Sweet Maid.',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/blog/',
  },
  openGraph: {
    title: '#1 Cleaning Tips & Professional Home Care Blog | Sweet Maid',
    description: 'Get expert cleaning tips, home organization hacks, and professional maid advice from the team at Sweet Maid.',
    url: 'https://sweetmaidcleaning.com/blog/',
  }
};

export default function BlogRoot() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  const rawHtml = getTemplate('blog');
  if (!rawHtml) return <div>Blog template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
