import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import ContentClient from './Content.client';
import type { CarFilters } from '@/types/cars';
import { carsInfiniteQuery } from '@/lib/queries';

interface CatalogProps {
  searchParams: Promise<CarFilters>;
}
const Content = async ({ searchParams }: CatalogProps) => {
  const queryClient = new QueryClient();
  const rawParams = await searchParams;
  const filters = {
    brand: rawParams.brand?.trim() ?? '',
    price: rawParams.price ? Number(rawParams.price) : undefined,
    minMileage: rawParams.minMileage ? Number(rawParams.minMileage) : undefined,
    maxMileage: rawParams.maxMileage ? Number(rawParams.maxMileage) : undefined,
  };

  await queryClient.infiniteQuery(carsInfiniteQuery(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentClient />
    </HydrationBoundary>
  );
};

export default Content;
