'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CarFilterForm from '@/components/CarFilterForm/CarFilterForm';
import { useCarFilterStore } from '@/lib/store/filterStore';
import type {CarFilters, CarsFiltersResponse } from '@/types/cars';

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

const SearchClient = ({ filtersOptions }: CatalogClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setFilters = useCarFilterStore(state => state.setFilters);
  const setFiltersOptions = useCarFilterStore(state => state.setFiltersOptions);

  useEffect(() => {
    setFiltersOptions(filtersOptions);
  });

  useEffect(() => {
    setFilters(parseFilters(searchParams));
  }, [searchParams, setFilters]);

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

  return <CarFilterForm onSearch={handleSearch} onClear={handleClear} />;
};

export default SearchClient;
