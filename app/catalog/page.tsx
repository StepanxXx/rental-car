import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Suspense } from 'react';
import type { GetCarsParams } from '@/types/cars';
import CatalogClient from './Catalog.client';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { carsInfiniteQuery, filterOptionsQuery } from '@/lib/queries';

const baseUrl = getBaseUrl();

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<GetCarsParams>;
}): Promise<Metadata> {
  const { brand, price, minMileage, maxMileage } = await searchParams;
  const title =
    brand || price || minMileage || maxMileage
      ? 'RentalCars catalog filtered by: ' +
        [
          brand ? 'brand: ' + brand : '',
          price ? 'price: ' + price : '',
          minMileage ? 'minMileage: ' + minMileage : '',
          maxMileage ? 'maxMileage: ' + maxMileage : '',
        ]
          .filter(Boolean)
          .join(', ')
      : 'RentalCar catalog - View and manage all cars';
  const description =
    brand || price || minMileage || maxMileage
      ? 'View and manage RentalCar cars filtered by: ' +
        [
          brand ? 'brand: ' + brand : '',
          price ? 'price: ' + price : '',
          minMileage ? 'minMileage: ' + minMileage : '',
          maxMileage ? 'maxMileage: ' + maxMileage : '',
        ]
          .filter(Boolean)
          .join(', ')
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

interface CatalogProps {
  searchParams: Promise<GetCarsParams>;
}
const Catalog = async ({ searchParams }: CatalogProps) => {
  const queryClient = new QueryClient();
  const rawParams = await searchParams;
  const filters = {
    brand: rawParams.brand?.trim() ?? '',
    price: rawParams.price ? Number(rawParams.price) : undefined,
    minMileage: rawParams.minMileage ? Number(rawParams.minMileage) : undefined,
    maxMileage: rawParams.maxMileage ? Number(rawParams.maxMileage) : undefined,
  };

  await Promise.all([
    queryClient
      .prefetchQuery(filterOptionsQuery())
      .catch(err => console.error('SSR filters prefetch error:', err)),
    queryClient
      .prefetchInfiniteQuery(carsInfiniteQuery(filters))
      .catch(err => console.error('SSR cars prefetch error:', err)),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="container">Loading catalog...</div>}>
        <CatalogClient />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Catalog;
