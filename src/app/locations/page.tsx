import { Metadata } from 'next';
import { getAllLocations } from '@/lib/data';
import LocationsDirectoryClient from '@/components/LocationsDirectoryClient';

export const metadata: Metadata = {
  title: 'Florida Cleaning Service Locations | Sweet Maid',
  description: 'Explore cities and service areas across Florida served by Sweet Maid Cleaning Service. Find dependable house cleaning and maid services near you.',
  alternates: {
    canonical: 'https://www.sweetmaidcleaning.com/locations/',
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

export default function LocationsPage() {
  const locations = getAllLocations();
  return <LocationsDirectoryClient locations={locations} />;
}
