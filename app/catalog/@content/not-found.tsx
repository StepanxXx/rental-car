// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// const NotFound = () => {
//   const router = useRouter();

//   useEffect(() => {
//     // Редірект через 3 секунди
//     const timer = setTimeout(() => router.push('/'), 3000);
//     return () => clearTimeout(timer);
//   }, [router]);

//   return (
//     <div>
//       <h1>404 - Сторінку не знайдено</h1>
//       <p>Вас буде перенаправлено на головну через кілька секунд…</p>
//     </div>
//   );
// };

// export default NotFound;

// 'use client';
// import css from './CarsNotFoundCard.module.css';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';

// export default function CarsNotFoundCard() {
//   const router = useRouter();
//   return (
//     <div className={css.wrapper}>
//       <Image
//         className={css.image}
//         src="/cars-not-found.avif"
//         alt="Car"
//         width={413.59}
//         height={388}
//         loading="lazy"
//         decoding="async"
//         placeholder="blur"
//         blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg=="
//       />
//       <h2 className={css.title}>No cars found</h2>
//       <p className={css.text}>
//         We couldn`t find any cars that match your current filters. Try changing
//         your search criteria or reset the filters.
//       </p>
//       <button className={css.buttonLink} onClick={() => router.push('/catalog')}>
//         Reset&nbsp;filters
//       </button>
//     </div>
//   );
// }

import css from './CarsNotFoundCard.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default async function CarsNotFoundCard() {
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
