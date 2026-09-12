import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import ContentClient from './Content.client';
import { parseCarFilters, type CarFilterSearchParams } from '@/lib/carFilters';
import { carsInfiniteQuery } from '@/lib/queries';

interface CatalogProps {
  searchParams: Promise<CarFilterSearchParams>;
}
const Content = async ({ searchParams }: CatalogProps) => {
  const queryClient = new QueryClient();
  const filters = parseCarFilters(await searchParams);

  await queryClient.infiniteQuery(carsInfiniteQuery(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentClient />
    </HydrationBoundary>
  );
};

export default Content;
