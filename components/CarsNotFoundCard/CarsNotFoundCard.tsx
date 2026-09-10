import css from './CarsNotFoundCard.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function CarsNotFoundCard() {
  return (
    <div className={css.wrapper}>
      <Image
        className={css.image}
        src="/cars-not-found.avif"
        alt="Car"
        width={413.59}
        height={388}
        loading="lazy"
        decoding="async"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg=="
      />
      <h2 className={css.title}>No cars found</h2>
      <p className={css.text}>
        We couldn`t find any cars that match your current filters. Try changing
        your search criteria or reset the filters.
      </p>
      <Link className={css.buttonLink} href="/catalog">
        Reset&nbsp;filters
      </Link>
    </div>
  );
}
