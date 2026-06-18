import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome Back to Sweet Maid - #1 Rated Cleaning Portal in Bradenton, FL',
  description: 'Login to your Sweet Maid Cleaning account to manage bookings, view schedules, and update your billing details.',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/login/',
  },
  openGraph: {
    title: 'Welcome Back to Sweet Maid - #1 Rated Cleaning Portal in Bradenton, FL',
    description: 'Login to your Sweet Maid Cleaning account to manage bookings, view schedules, and update your billing details.',
    url: 'https://sweetmaidcleaning.com/login/',
  }
};

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
