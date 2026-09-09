'use client';

import { useEffect } from 'react';
import {
  keepPreviousData,
  useQuery,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CarFilterForm from '@/components/CarFilterForm/CarFilterForm';
import { useCarFilterStore } from '@/lib/store/filterStore';
import type { Car, CarFilters, CarsFiltersResponse } from '@/types/cars';
import { INITIAL_PAGE } from '@/lib/const';
import { carsQuery, filterOptionsQuery } from '@/lib/queries';

const FILTER_KEYS = ['brand', 'price', 'minMileage', 'maxMileage'] as const;

const parseNumber = (value: string | null) => {
  const num = Number(value);
  return value && Number.isFinite(num) ? num : undefined;
};

const parseFilters = (searchParams: URLSearchParams): CarFilters => ({
  brand: searchParams.get('brand')?.trim() ?? '',
  price: parseNumber(searchParams.get('price')),
  minMileage: parseNumber(searchParams.get('minMileage')),
  maxMileage: parseNumber(searchParams.get('maxMileage')),
});

const CatalogClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setFilters = useCarFilterStore(state => state.setFilters);

  const currentFilters = parseFilters(searchParams);

  useEffect(() => {
    setFilters(parseFilters(searchParams));
  }, [searchParams, setFilters]);

  // const { data, isError, isLoading, isFetching } = useQuery({
  //   ...carsQuery(currentFilters, INITIAL_PAGE),
  //   placeholderData: keepPreviousData,
  // });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery({
    ...carsQuery(currentFilters, INITIAL_PAGE),
    placeholderData: keepPreviousData,
    initialPageParam: 0,
    getNextPageParam: lastResponse => {
      console.log('lastResponse', lastResponse);
      const nextPage = lastResponse.page + 1;
      return nextPage < lastResponse.totalPages ? nextPage : undefined;
    },
    select: data => {
      return {
        ...data,
        cars: data.pages.flatMap(page => page.cars),
      };
    },
  });

  const {
    data: filtersOptions,
    isLoading: isFilterLoading,
    isError: isFilterError,
  } = useQuery({
    ...filterOptionsQuery(),
    refetchOnMount: false,
  });

  const handleSearch = (nextFilters: CarFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    FILTER_KEYS.forEach(key => {
      const value = nextFilters[key];
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  const cars: Car[] = data?.cars ?? [];

  return (
    <div className="container">
      {!isFilterLoading && !isFilterError && (
        <CarFilterForm
          onSearch={handleSearch}
          onClear={handleClear}
          filtersOptions={filtersOptions as CarsFiltersResponse}
        />
      )}

      {(isLoading || isFilterLoading) && <p>Loading cars...</p>}
      {isFetching && !isLoading && <p>Updating cars...</p>}
      {(isError || isFilterError) && <p>Could not load cars.</p>}
      {!isLoading && !isError && (
        <>
          <pre>{JSON.stringify(cars, null, 2)}</pre>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetching}
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
                ? 'Load more'
                : 'Nothing more to load'}
          </button>
        </>
      )}
    </div>
  );
};

export default CatalogClient;
