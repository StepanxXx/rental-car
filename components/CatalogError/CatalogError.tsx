import css from './CatalogError.module.css';

interface CatalogErrorProps {
  message: string;
  onRetry: () => void;
}

export default function CatalogError({ message, onRetry }: CatalogErrorProps) {
  return (
    <div className={css.wrapper} role="alert">
      <p className={css.message}>{message}</p>
      <button className={css.retryButton} type="button" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
