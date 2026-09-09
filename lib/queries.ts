import { queryOptions } from '@tanstack/react-query';
import { getCars, getCarsFilters } from '@/lib/api';
import { INITIAL_PAGE, PER_PAGE } from '@/lib/const';
import type { CarFilters } from '@/types/cars';

export const filterOptionsQuery = () =>
  queryOptions({
    queryKey: ['filtersOptions'],
    queryFn: getCarsFilters,
    staleTime: 1000 * 60 * 10,
  });

export const carsQuery = (filters?: CarFilters, page: number = INITIAL_PAGE) =>
  queryOptions({
    queryKey: ['cars', filters, page],
    queryFn: () =>
      getCars({
        ...filters,
        perPage: PER_PAGE,
        page,
      }),
    staleTime: 1000 * 10,
  });
