import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import axios from 'axios';
import { getCarById } from '@/lib/api';
import CarDetails from './CarDetails';

const getCar = cache(async (carId: string) => {
  try {
    return await getCarById(carId);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  }
});

interface CarDetailsPageProps {
  params: Promise<{ carId: string }>;
}

export async function generateMetadata({
  params,
}: CarDetailsPageProps): Promise<Metadata> {
  const { carId } = await params;
  const car = await getCar(carId);
  const title = `${car.brand} ${car.model}, ${car.year} | RentalCar`;

  return {
    title,
    description: car.description.slice(0, 200),
    openGraph: {
      title,
      description: car.description.slice(0, 200),
      url: `/catalog/${carId}`,
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
      description: car.description.slice(0, 200),
      images: [car.img],
    },
  };
}

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const { carId } = await params;
  const car = await getCar(carId);

  return (
    <main>
      <CarDetails car={car} />
    </main>
  );
}
