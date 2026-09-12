import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getCarById } from '@/lib/api';
import CarDetailsClient from './CarDetailsClient';

const queryClient = new QueryClient();

function getCarQueryOptions(id: string) {
  return {
    queryKey: ['car', id],
    queryFn: async () => {
      try {
        return await getCarById(id);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          notFound();
        }

        throw error;
      }
    },
  };
}

interface EventDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const car = await queryClient.query(getCarQueryOptions(id));
  const title = `Car: ${car.brand} ${car.model}, ${car.year}`;
  const description = car.description.slice(0, 200);

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `/cars/${id}`,
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
}

export default async function EventDetailsPage({ params }: EventDetailsProps) {
  const { id } = await params;

  const car = await queryClient.query(getCarQueryOptions(id));

  return <CarDetailsClient car={car} />;
}
