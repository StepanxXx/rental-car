'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCarFilterStore } from '@/lib/store/filterStore';
import { getCars } from '@/lib/api';
import type { Car } from '@/types/cars';
import { PER_PAGE, INITIAL_PAGE } from '@/lib/const';

const CatalogClient = () => {
  const { filters } = useCarFilterStore();
  const { brand, price, minMileage, maxMileage } = filters;

  const {
    data,
    isError,
    isLoading,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ['cars', brand, price, minMileage, maxMileage, 1],
    queryFn: () =>
      getCars({
        brand: 'Aston Martin',
        price,
        minMileage,
        maxMileage,
        perPage: PER_PAGE,
        page: INITIAL_PAGE,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const cars: Car[] = data?.cars ?? [];

  return (
    <div className="container">
      <pre>{JSON.stringify(cars, null, 2)}</pre>
    </div>
  );
};
export default CatalogClient;