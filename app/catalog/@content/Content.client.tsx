'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import CarsList from '@/components/CarsList/CarsList';
import type { Car, CarFilters } from '@/types/cars';
import { carsInfiniteQuery } from '@/lib/queries';
import css from './Content.module.css';
import CarsLoader from '@/components/CarsLoader/CarsLoader';
import CarsNotFoundCard from '@/components/CarsNotFoundCard/CarsNotFoundCard';

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

const ContentClient = () => {
  const searchParams = useSearchParams();

  const currentFilters = parseFilters(searchParams);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery({
    ...carsInfiniteQuery(currentFilters),
    placeholderData: keepPreviousData,
  });

  const cars: Car[] = data?.pages.flatMap(page => page.cars) ?? [];

  if (isError) {
    return (
      <div className={css.errorWrapper} role="alert">
        <p className={css.errorMessage}>
          Failed to load cars. Please try again later.
        </p>
      </div>
    );
  }

  if (!isLoading && cars.length === 0) {
    return <CarsNotFoundCard />;
  }

  return (
    <>
      <h2 className="visually-hidden">Cars list</h2>
      {!isLoading  && (
        <>
          <div className={css.carsListWrapper}>
            <CarsList cars={cars} />
            <CarsLoader
              isActive={isLoading || isFetching || isFetchingNextPage}
            />
          </div>
          {hasNextPage && (
            <button
              className={css.loadMore}
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Load&nbsp;more
            </button>
          )}
        </>
      )}
    </>
  );
};

export default ContentClient;
