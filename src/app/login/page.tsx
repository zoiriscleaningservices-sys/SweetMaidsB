import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';

export default function LoginRoot() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  // Note: if there is no login template, this will just fallback gracefully, or you can supply a standalone JSX
  const rawHtml = getTemplate('login');
  if (!rawHtml) return <div className="min-h-screen flex items-center justify-center bg-pink-50 text-pink-500 font-bold text-2xl">Client Portal Coming Soon</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, true);

  return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
}
