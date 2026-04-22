import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';

// Default entry point for root `/` is the base template (Bradenton)
export default function HomePage() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  const rawHtml = getTemplate('home');
  if (!rawHtml) return <div>Home template missing</div>;

  const bodyContent = extractSections(rawHtml);
  // Pass is_sub_page as false to keep the `/images/` path correctly referenced 
  // actually wait, our template.ts replace fixes all image paths to be absolute root `/images/`!
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, false);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
