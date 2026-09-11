'use client';

import css from './Content.module.css';

interface ErrorProps {
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className={css.errorWrapper} role="alert">
      <p className={css.errorMessage}>
        Failed to load cars. Please try again later.
      </p>
      <button className={css.retryButton} type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
