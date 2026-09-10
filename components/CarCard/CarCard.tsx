import Link from 'next/link';
import Image from 'next/image';
import css from './CarCard.module.css';
import type { Car } from '@/types/cars';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className={css.card}>
      <Image
        className={css.image}
        src={car.img}
        alt={`${car.model} - ${car.brand} - ${car.year}`}
        width={244}
        height={268}
        loading="lazy"
        placeholder="blur"
        decoding="async"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg=="
      />
      <h3 className={css.title}>
        <span>
          {car.brand} <span className={css.model}>{car.model}</span>,{' '}
          {car.year}
        </span>
        <span className={css.price}>${car.rentalPrice}</span>
      </h3>
      <div className={css.baseInfo}>
        {car.location.city}
        {' | '}
        {car.location.country}
        {' | '}
        {car.rentalCompany}
        {' | '}
        {car.type}
        {' | '}
        {car.mileage} km
      </div>
      <Link href={`/cars/${car.id}`}>Read more</Link>
    </div>
  );
}
