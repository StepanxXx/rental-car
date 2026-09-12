import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  Query,
} from "@tanstack/react-query";
import { getCarById } from "@/lib/api";
import CarDetailsClient from "./CarDetailsClient";


interface EventDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailsProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const car = await getCarById(id);
    const title = `Car: ${car.brand} ${car.model}, ${car.year}`;
    const description = car.description.slice(0, 200);

    return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `/catalog/${id}`,
      siteName: 'Rental Car',
      images: [
        {
          url: car.img,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [car.img],
    },
  };
  } catch {
    return {
      title: "Car not found",
    };
  }
}

export default async function EventDetailsPage({ params }: EventDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

    const car = await queryClient.query({
      queryKey: ['event', id],
      queryFn: () => getCarById(id),
    });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CarDetailsClient car={car}/>
    </HydrationBoundary>
  );
}
