import { infiniteQueryOptions, mutationOptions } from '@tanstack/react-query';
import { getCars, createBookingRequest, BookingRequestData } from '@/lib/api';
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

export const carBookingMutation = (
  mutationFn: (data: BookingRequestData) => Promise<void>,
  successCallback: () => void,
  errorCallback: () => void
) =>
  mutationOptions({
    mutationKey: ['carBooking'],
    mutationFn: mutationFn,
    onSuccess: successCallback,
    onError: errorCallback,
  });
