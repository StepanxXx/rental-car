import Link from 'next/link';
import Image from 'next/image';
import css from './CarCard.module.css';
import type { Car } from '@/types/cars';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const mileage = new Intl.NumberFormat('uk-UA').format(car.mileage);

  return (
    <article className={css.card}>
      <Image
        className={css.image}
        src={car.img}
        alt={`${car.brand} ${car.model}, ${car.year}`}
        width={244}
        height={268}
        loading="lazy"
        placeholder="blur"
        decoding="async"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg=="
      />
      <h3 className={css.title}>
        <span className={css.carName}>
          {car.brand} <span className={css.model}>{car.model}</span>, {car.year}
        </span>
        <span className={css.price}>${car.rentalPrice}</span>
      </h3>
      <ul className={css.baseInfo} aria-label="Car details">
        <li>{car.location.city}</li>
        <li>{car.location.country}</li>
        <li>{car.rentalCompany}</li>
        <li>{car.type}</li>
        <li>{mileage} km</li>
      </ul>
      <Link
        className={css.readMore}
        href={`/cars/${car.id}`}
        aria-label={`Read more about ${car.brand} ${car.model}`}
      >
        Read&nbsp;more
      </Link>
    </article>
  );
}
