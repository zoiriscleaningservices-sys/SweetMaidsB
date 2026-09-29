import { Metadata } from 'next';
import { getAllLocations } from '@/lib/data';
import LocationsDirectoryClient from '@/components/LocationsDirectoryClient';

interface LocationsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: LocationsPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const q = resolved?.q;

  return {
    title: 'Florida Cleaning Service Locations | Sweet Maid',
    description: 'Explore cities and service areas across Florida served by Sweet Maid Cleaning Service. Find dependable house cleaning and maid services near you.',
    alternates: {
      canonical: 'https://www.sweetmaidcleaning.com/locations/',
    },
    robots: q
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: 'Florida Cleaning Service Locations | Sweet Maid',
      description: 'Explore cities and service areas across Florida served by Sweet Maid Cleaning Service. Find dependable house cleaning and maid services near you.',
      url: 'https://www.sweetmaidcleaning.com/locations/',
      type: 'website',
      images: ['https://i.ibb.co/QSD3Ydt/image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Florida Cleaning Service Locations | Sweet Maid',
      description: 'Explore cities and service areas across Florida served by Sweet Maid Cleaning Service.',
      images: ['https://i.ibb.co/QSD3Ydt/image.jpg'],
    },
  };
}

export default async function LocationsPage({ searchParams }: LocationsPageProps) {
  const resolved = await searchParams;
  const initialQuery = resolved?.q || '';
  const locations = getAllLocations();
  return <LocationsDirectoryClient locations={locations} initialQuery={initialQuery} />;
}
