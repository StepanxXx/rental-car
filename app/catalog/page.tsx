import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { getCarsFilters } from '@/lib/api';
import type { GetCarsParams } from '@/types/cars';
import { EMPTY_FILTER_OPTIONS } from '@/lib/carFilters';
import SearchClient from './Search.client';
import { getBaseUrl } from '@/lib/getBaseUrl';

const baseUrl = getBaseUrl();

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
  const {
    brand: queryBrand,
    price: queryPrice,
    minMileage: queryMinMileage,
    maxMileage: queryMaxMileage,
  } = await searchParams;

  const { brands, price: priceRange } =
    (await readFiltersOptions()) ?? EMPTY_FILTER_OPTIONS;

  const brand =
    queryBrand && brands.includes(queryBrand) ? queryBrand?.trim() : undefined;
  const price =
    queryPrice && queryPrice >= priceRange.min && queryPrice <= priceRange.max
      ? Number(queryPrice)
      : undefined;
  const minMileage = queryMinMileage ? Number(queryMinMileage) : undefined;
  const maxMileage = queryMaxMileage ? Number(queryMaxMileage) : undefined;

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

const Catalog = async () => {
  const filtersOptions = await readFiltersOptions();

  return (
    <SearchClient filtersOptions={filtersOptions ?? EMPTY_FILTER_OPTIONS} />
  );
};

export default Catalog;
