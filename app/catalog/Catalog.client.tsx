'use client';

import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CarFilterForm from '@/components/CarFilterForm/CarFilterForm';
import { useCarFilterStore } from '@/lib/store/filterStore';
import { getCars } from '@/lib/api';
import type { Car, CarFilters } from '@/types/cars';
import { PER_PAGE, INITIAL_PAGE } from '@/lib/const';

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

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ['cars', currentFilters, INITIAL_PAGE],
    queryFn: () =>
      getCars({
        ...currentFilters,
        perPage: PER_PAGE,
        page: INITIAL_PAGE,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
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

  const cars: Car[] = data?.cars ?? [];

  return (
    <div className="container">
      <CarFilterForm onSearch={handleSearch} />

      {isLoading && <p>Loading cars...</p>}
      {isFetching && !isLoading && <p>Updating cars...</p>}
      {isError && <p>Could not load cars.</p>}
      {!isLoading && !isError && <pre>{JSON.stringify(cars, null, 2)}</pre>}
    </div>
  );
};

export default CatalogClient;
