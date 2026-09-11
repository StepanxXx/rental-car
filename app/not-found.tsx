import Link from 'next/link';
import css from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={css.main}>
      <div className={`container ${css.wrapper}`}>
        <p className={css.code}>404</p>
        <h1 className={css.title}>Page not found</h1>
        <p className={css.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link className={css.homeLink} href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
