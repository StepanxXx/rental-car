'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import CarsList from '@/components/CarsList/CarsList';
import type { Car } from '@/types/cars';
import { parseCarFilters } from '@/lib/carFilters';
import { carsInfiniteQuery } from '@/lib/queries';
import css from './Content.module.css';
import CarsLoader from '@/components/CarsLoader/CarsLoader';
import CarsNotFoundCard from '@/components/CarsNotFoundCard/CarsNotFoundCard';

const ContentClient = () => {
  const searchParams = useSearchParams();

  const currentFilters = parseCarFilters(searchParams);

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
    throw Error('Failed to load cars');
  }

  if (!isLoading && cars.length === 0) {
    return <CarsNotFoundCard />;
  }

  return (
    <>
      <h2 className="visually-hidden">Cars list</h2>
      {!isLoading && (
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
