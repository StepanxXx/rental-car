'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CarFilterForm from '@/components/CarFilterForm/CarFilterForm';
import { filtersToSearchParams, parseCarFilters } from '@/lib/carFilters';
import { useCarFilterStore } from '@/lib/store/filterStore';
import type { CarFilters, CarsFiltersResponse } from '@/types/cars';

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
  }, [filtersOptions, setFiltersOptions]);

  useEffect(() => {
    setFilters(parseCarFilters(searchParams));
  }, [searchParams, setFilters]);

  const handleSearch = (nextFilters: CarFilters) => {
    const params = filtersToSearchParams(nextFilters, searchParams.toString());

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  return <CarFilterForm onSearch={handleSearch} onClear={handleClear} />;
};

export default SearchClient;
