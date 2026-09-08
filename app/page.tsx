import Image from 'next/image';
import css from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className={css.hero}>
      <Image
        src="/hero.avif"
        alt="Hero background"
        fill
        priority
        style={{ objectFit: 'cover' }}
      />

      <div className="container">
        <div className={css.content}>
          <h1 className={css.title}>Find your perfect rental&nbsp;car</h1>
          <p className={css.description}>
            Reliable and <span className="no-split">budget-friendly</span>{' '}
            rentals for any journey
          </p>
          <Link
            href="/catalog"
            className={css.linkBtn}
            aria-label="View catalog"
          >
            View&nbsp;Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
