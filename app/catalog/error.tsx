'use client';

import css from './CatalogLayout.module.css';

interface ErrorProps {
  reset: () => void;
}

export default function CatalogError({ reset }: ErrorProps) {
  return (
    <div className={css.errorWrapper} role="alert">
      <p className={css.errorMessage}>
        Failed to load the catalog. Please try again later.
      </p>
      <button className={css.retryButton} type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
