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
      <div className={css.imageWrapper}>
        <Image
          className={css.image}
          src={car.img}
          alt={`${car.brand} ${car.model}, ${car.year}`}
          fill
          sizes="(min-width: 1232px) 244px, (min-width: 768px) 320px, calc(100vw - 64px)"
          loading="eager"
          priority
          decoding="async"
        />
      </div>
      <h3 className={css.title}>
        <span className={css.carName}>
          {car.brand} <span className={css.model}>{car.model}</span>, {car.year}
        </span>
        <span className={css.price}>${car.rentalPrice}</span>
      </h3>
      <div className={css.baseInfo} aria-label="Car details">
        <ul className={css.row}>
          <li tabIndex={0} data-tooltip={car.location.city}>
            <span className={css.metaText}>{car.location.city}</span>
          </li>
          <li tabIndex={0} data-tooltip={car.location.country}>
            <span className={css.metaText}>{car.location.country}</span>
          </li>
          <li tabIndex={0} data-tooltip={car.rentalCompany}>
            <span className={css.metaText}>{car.rentalCompany}</span>
          </li>
        </ul>
        <ul className={css.row}>
          <li tabIndex={0} data-tooltip={car.type}>
            <span className={css.metaText}>{car.type}</span>
          </li>
          <li tabIndex={0} data-tooltip={`${mileage} km`}>
            <span className={css.metaText}>{mileage} km</span>
          </li>
        </ul>
      </div>
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
