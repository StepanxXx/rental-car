'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './Header.module.css';

export default function Header() {
  const path = usePathname();

  return (
    <header className={css.header}>
      <div className={`container ${css.headerContainer}`}>
        <Link href="/" aria-label="Home" className={css.headerLink}>
          <svg width="104" height="16">
            <use href="icons.svg#icon-Logo"></use>
          </svg>
        </Link>
        <nav aria-label="Main Navigation">
          <ul className={css.navigation}>
            <li className={css.navigationItem}>
              <Link
                href="/"
                aria-label="Home"
                className={`${css.navigationLink} ${path === '/' && css.active}`}
              >
                Home
              </Link>
            </li>
            <li className={css.navigationItem}>
              <Link
                href="/catalog"
                aria-label="Catalog"
                className={`${css.navigationLink} ${path === '/catalog' && css.active}`}
              >
                Catalog
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
