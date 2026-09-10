'use client';

import { useEffect } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CarFilterForm from '@/components/CarFilterForm/CarFilterForm';
import CarsList from '@/components/CarsList/CarsList';
import { useCarFilterStore } from '@/lib/store/filterStore';
import type { Car, CarFilters, CarsFiltersResponse } from '@/types/cars';
import { carsInfiniteQuery } from '@/lib/queries';
import css from './Catalog.module.css';
import CarsLoader from '@/components/CarsLoader/CarsLoader';
import CarsNotFoundCard from '@/components/CarsNotFoundCard/CarsNotFoundCard';

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

interface CatalogClientProps {
  filtersOptions: CarsFiltersResponse;
}

const CatalogClient = ({ filtersOptions }: CatalogClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setFilters = useCarFilterStore(state => state.setFilters);
  const setFiltersOptions = useCarFilterStore(state => state.setFiltersOptions);

  useEffect(() => {
    setFiltersOptions(filtersOptions);
  });

  const currentFilters = parseFilters(searchParams);

  useEffect(() => {
    setFilters(parseFilters(searchParams));
  }, [searchParams, setFilters]);

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

  const cars: Car[] = data?.pages.flatMap(page => page.cars) ?? [];

  return (
    <main>
      <h1 className="visually-hidden">Cars catalog</h1>
      <section>
        <div className={`container ${css.catalogContainer}`}>
          <h2 className="visually-hidden">Find your perfect rental&nbsp;car</h2>
          <CarFilterForm onSearch={handleSearch} onClear={handleClear} />
        </div>
      </section>
      <section className={css.catalogSection}>
        <div className={`container ${css.catalogContainer}`}>
          {(isError || cars.length === 0) && !isLoading ? (
            <CarsNotFoundCard />
          ) : (
            <>
              <h2 className="visually-hidden">Cars list</h2>
              {!isLoading && !isError && (
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
          )}
        </div>
      </section>
    </main>
  );
};

export default CatalogClient;
