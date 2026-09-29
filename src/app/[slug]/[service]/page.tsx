import { notFound, permanentRedirect } from 'next/navigation';
import { SERVICES, CITY_PAGES } from '@/config/site-structure';
import { DECOMMISSIONED_SERVICES } from '@/config/redirects';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, service: string }> }) {
  const { slug, service } = await params;
  const canonicalService = DECOMMISSIONED_SERVICES[service] || service;

  if (slug === 'longboat-key-fl') {
    permanentRedirect(`/${canonicalService}-longboat-key-fl/`);
  }

  const isApprovedCity = !!CITY_PAGES[slug] || slug === 'bradenton-fl';
  const isApprovedService = (SERVICES as readonly string[]).includes(canonicalService);

  if (isApprovedCity && isApprovedService) {
    permanentRedirect(`/${canonicalService}-${slug}/`);
  }

  return {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string, service: string }> }) {
  const { slug, service } = await params;
  const canonicalService = DECOMMISSIONED_SERVICES[service] || service;

  if (slug === 'longboat-key-fl') {
    permanentRedirect(`/${canonicalService}-longboat-key-fl/`);
  }

  const isApprovedCity = !!CITY_PAGES[slug] || slug === 'bradenton-fl';
  const isApprovedService = (SERVICES as readonly string[]).includes(canonicalService);

  if (isApprovedCity && isApprovedService) {
    permanentRedirect(`/${canonicalService}-${slug}/`);
  }

  notFound();
}

