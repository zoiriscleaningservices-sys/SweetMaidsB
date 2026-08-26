import { Metadata } from 'next';
import { getAllLocations } from '@/lib/data';
import LocationsDirectoryClient from '@/components/LocationsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Cleaning Service Locations in Florida (799+ Cities) | Sweet Maid',
  description: 'Explore all 799+ cities and service areas across Florida served by Sweet Maid. Search your local city for top-rated, reliable house cleaning and maid services.',
  keywords: 'cleaning services Florida, Florida maid service directory, house cleaning locations FL, commercial cleaning Florida cities',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/locations/',
  },
  openGraph: {
    title: 'All Cleaning Service Locations in Florida (799+ Cities) | Sweet Maid',
    description: 'Explore all 799+ cities and service areas across Florida served by Sweet Maid. Search your local city for top-rated, reliable house cleaning and maid services.',
    url: 'https://sweetmaidcleaning.com/locations/',
    type: 'website',
    images: ['https://i.ibb.co/QSD3Ydt/image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Cleaning Service Locations in Florida (799+ Cities) | Sweet Maid',
    description: 'Explore all 799+ cities and service areas across Florida served by Sweet Maid.',
    images: ['https://i.ibb.co/QSD3Ydt/image.jpg'],
  },
};

export default function LocationsPage() {
  const locations = getAllLocations();
  return <LocationsDirectoryClient locations={locations} />;
}
