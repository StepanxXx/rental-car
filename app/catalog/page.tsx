import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Suspense } from 'react';
import { getCars, getCarsFilters } from '@/lib/api';
import type { GetCarsParams } from '@/types/cars';
import CatalogClient from './Catalog.client';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { INITIAL_PAGE, PER_PAGE } from '@/lib/const';

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
  const filters = await searchParams;
  await Promise.all([
    queryClient
      .query({
        queryKey: ['filtersOptions'],
        queryFn: getCarsFilters,
        staleTime: 1000 * 60 * 10,
      })
      .catch(err => console.error('SSR filters prefetch error:', err)),
    queryClient
      .query({
        queryKey: ['cars', filters, INITIAL_PAGE],
        queryFn: () =>
          getCars({ ...filters, perPage: PER_PAGE, page: INITIAL_PAGE }),
        staleTime: 1000 * 5,
      })
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
