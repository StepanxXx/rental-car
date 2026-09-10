import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { cache, Suspense } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getCarsFilters } from '@/lib/api';
import type { CarsFiltersResponse, GetCarsParams } from '@/types/cars';
import CatalogClient from './Catalog.client';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { carsInfiniteQuery } from '@/lib/queries';

const baseUrl = getBaseUrl();

const EMPTY_FILTERS: CarsFiltersResponse = {
  brands: [],
  price: { min: 0, max: 0 },
};

const getCachedFiltersOptions = unstable_cache(
  async () => getCarsFilters(),
  ['catalog-filters-options'],
  {
    revalidate: 60 * 60 * 24,
    tags: ['catalog-filters-options'],
  }
);

const readFiltersOptions = cache(async () => {
  try {
    return await getCachedFiltersOptions();
  } catch (error) {
    console.error('Failed to load catalog filters:', error);
    return null;
  }
});

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<GetCarsParams>;
}): Promise<Metadata> {
  const { brand, price, minMileage, maxMileage } = await searchParams;
  const filtersOptions = await readFiltersOptions();

  if (filtersOptions) {
    const { brands, price: priceRange } = filtersOptions;
    if (brand && !brands.includes(brand)) {
      notFound();
    }
    if (price && (price < priceRange.min || price > priceRange.max)) {
      notFound();
    }
  }
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
  const filtersOptions = await readFiltersOptions();
  const rawParams = await searchParams;
  const filters = {
    brand: rawParams.brand?.trim() ?? '',
    price: rawParams.price ? Number(rawParams.price) : undefined,
    minMileage: rawParams.minMileage ? Number(rawParams.minMileage) : undefined,
    maxMileage: rawParams.maxMileage ? Number(rawParams.maxMileage) : undefined,
  };

  queryClient
    .infiniteQuery(carsInfiniteQuery(filters))
    .catch(err => console.error('SSR cars prefetch error:', err));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="container">Loading catalog...</div>}>
        <CatalogClient filtersOptions={filtersOptions ?? EMPTY_FILTERS} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Catalog;
