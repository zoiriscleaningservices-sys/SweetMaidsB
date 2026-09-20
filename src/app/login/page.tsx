import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Portal & Account Login | Sweet Maid Cleaning Services',
  description: 'Log in to your Sweet Maid Cleaning customer portal. Easily schedule recurring maid services, book deep home cleanings, manage appointments, and view invoices.',
  keywords: 'cleaning services login, sweet maid portal, customer portal cleaning, house cleaning services, professional maid service, deep cleaning booking, move in out cleaning, recurring maid service, residential cleaning, commercial cleaning, apartment cleaning, cleaning client account',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/login/',
  },
  openGraph: {
    title: 'Customer Portal & Account Login | Sweet Maid Cleaning Services',
    description: 'Log in to your Sweet Maid Cleaning customer portal. Easily schedule recurring maid services, book deep home cleanings, manage appointments, and view invoices.',
    url: 'https://sweetmaidcleaning.com/login/',
    type: 'website',
    images: ['https://i.ibb.co/QSD3Ydt/image.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Portal & Account Login | Sweet Maid Cleaning Services',
    description: 'Log in to your Sweet Maid Cleaning customer portal. Easily schedule recurring maid services, book deep home cleanings, manage appointments, and view invoices.',
    images: ['https://i.ibb.co/QSD3Ydt/image.jpg']
  }
};

export default function LoginRoot() {
  const rawHtml = getTemplate('login');
  if (!rawHtml) return <div className="min-h-screen flex items-center justify-center bg-pink-50 text-pink-500 font-bold text-2xl">Client Portal Coming Soon</div>;

  const bodyContent = extractSections(rawHtml);
  // Zero city targeting for login page
  const cleanHtml = localizedReplace(bodyContent, '', '', true, 'cleaning');

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
