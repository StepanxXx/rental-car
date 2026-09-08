'use client';

import { useState, useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CarFilterForm from '@/components/CarFilterForm/CarFilterForm';
import { useCarFilterStore } from '@/lib/store/filterStore';
import { getCars } from '@/lib/api';
import type { Car, CarFilters, GetCarsParams } from '@/types/cars';
import { PER_PAGE, INITIAL_PAGE } from '@/lib/const';

const FILTER_KEYS = ['brand', 'price', 'minMileage', 'maxMileage'] as const;

const toOptionalNumber = (value: string | null) => {
  if (!value?.trim()) return undefined;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const normalizeFilters = ({
  brand,
  price,
  minMileage,
  maxMileage,
}: GetCarsParams): CarFilters => ({
  ...(brand && { brand: brand.trim() }),
  ...(price && { price }),
  ...(minMileage && { minMileage }),
  ...(maxMileage && { maxMileage }),
});

const getUrlFilters = (searchParams: URLSearchParams): CarFilters => ({
  brand: searchParams.get('brand')?.trim() ?? '',
  price: toOptionalNumber(searchParams.get('price')),
  minMileage: toOptionalNumber(searchParams.get('minMileage')),
  maxMileage: toOptionalNumber(searchParams.get('maxMileage')),
});

const hasUrlFilters = (searchParams: URLSearchParams) =>
  FILTER_KEYS.some(key => searchParams.has(key));

const isEqual = (a: GetCarsParams, b: CarFilters): boolean =>
  (a.brand?.trim() ?? '') === b.brand &&
  a.price === b.price &&
  a.minMileage === b.minMileage &&
  a.maxMileage === b.maxMileage;

type CatalogContentProps = {
  initialSearchParams: string;
};

const CatalogContent = ({ initialSearchParams }: CatalogContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const setFilters = useCarFilterStore(state => state.setFilters);
  const filters = useCarFilterStore(state => state.filters);

  const urlSearchParams = new URLSearchParams(initialSearchParams);
  const currentFilters = hasUrlFilters(urlSearchParams)
    ? getUrlFilters(urlSearchParams)
    : normalizeFilters(filters);

  useEffect(() => {
    if (!isEqual(filters, currentFilters)) {
      setFilters(currentFilters);
    }
  }, [initialSearchParams]);

  useEffect(() => {
    if (
      !initialSearchParams &&
      FILTER_KEYS.some(key => currentFilters[key] !== '')
    ) {
      const nextFilters = normalizeFilters(currentFilters);
      const query = new URLSearchParams(
        nextFilters as Record<string, string>
      );
      router.push(`${pathname}?${query.toString()}`);
    }
  }, [currentFilters]);

  const [appliedFilters, setAppliedFilters] = useState<CarFilters>(filters);

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ['cars', appliedFilters, INITIAL_PAGE],
    queryFn: () =>
      getCars({
        ...filters,
        perPage: PER_PAGE,
        page: INITIAL_PAGE,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const handleSearch = (nextFilters: CarFilters) => {
    const nextSearchParams = new URLSearchParams(initialSearchParams);

    FILTER_KEYS.forEach(key => nextSearchParams.delete(key));
    FILTER_KEYS.forEach(key => {
      const value = nextFilters[key];
      if (value !== undefined && value !== '') {
        nextSearchParams.set(key, String(value));
      }
    });

    setAppliedFilters(nextFilters);

    const query = nextSearchParams.toString();
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

const CatalogClient = () => {
  const searchParams = useSearchParams();


  const initialSearchParams = searchParams.toString();

  return (
    <CatalogContent
      key={initialSearchParams}
      initialSearchParams={initialSearchParams}
    />
  );
};

export default CatalogClient;
