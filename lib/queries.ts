import { infiniteQueryOptions } from '@tanstack/react-query';
import { getCars } from '@/lib/api';
import { INITIAL_PAGE, PER_PAGE } from '@/lib/const';
import type { CarFilters } from '@/types/cars';

export const carsInfiniteQuery = (filters?: CarFilters) =>
  infiniteQueryOptions({
    queryKey: ['cars', filters],
    queryFn: ({ pageParam = INITIAL_PAGE }) =>
      getCars({
        ...filters,
        perPage: PER_PAGE,
        page: pageParam,
      }),
    initialPageParam: INITIAL_PAGE,
    getNextPageParam: lastResponse => {
      const nextPage = lastResponse.page + 1;
      return nextPage <= lastResponse.totalPages ? nextPage : undefined;
    },
    staleTime: 1000 * 10,
  });
