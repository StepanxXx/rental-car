import { Metadata } from 'next';
import { Suspense } from 'react';
import { type GetCarsParams } from '@/lib/api';
import CatalogClient from './Catalog.client';
import { getBaseUrl } from '@/lib/getBaseUrl';

const baseUrl = getBaseUrl();

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<GetCarsParams>;
}): Promise<Metadata> {
  const { brand, price, minMileage, maxMileage } = await searchParams;
  const title =
    brand || price || minMileage || maxMileage
      ? 'RentalCars catalog filtered by: ' + [
          brand ? 'brand: ' + brand : '',
          price ? 'price: ' + price : '',
          minMileage ? 'minMileage: ' + minMileage : '',
          maxMileage ? 'maxMileage: ' + maxMileage : '',
        ].filter(Boolean).join(', ')
      : 'RentalCar catalog - View and manage all cars';
  const description =
    brand || price || minMileage || maxMileage
      ? 'View and manage RentalCar cars filtered by: ' + [
          brand ? 'brand: ' + brand : '',
          price ? 'price: ' + price : '',
          minMileage ? 'minMileage: ' + minMileage : '',
          maxMileage ? 'maxMileage: ' + maxMileage : '',
        ].filter(Boolean).join(', ')
      : 'View and manage RentalCar cars.';

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title: title,
      description: description,
      url: baseUrl,
      siteName: title,
      images: [
        {
          url: '/hero.avif',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/hero.avif'],
    },
  };
}

const Catalog = async () => {
  return (
    <Suspense fallback={<div className="container">Loading catalog...</div>}>
      <CatalogClient />
    </Suspense>
  );
};

export default Catalog;
