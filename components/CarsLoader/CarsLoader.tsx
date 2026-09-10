import css from './CarsLoader.module.css';

type LoaderProps = {
  isActive: boolean;
};

export default function CarsLoader({ isActive = true }: LoaderProps) {
  return (
    <div className={isActive ? css.backdrop : 'visually-hidden'}>
      <div className={css.loader}>
        <div className={css.spinnerWrapper}>
          <svg className={css.spinner} width="72" height="72">
            <use href="/icons.svg#icon-loader" />
          </svg>
        </div>
        <p className={css.textLoading}>Loading cars...</p>
        <p className={css.textDescription}>
          Please wait while we fetch the best cars&nbsp;for&nbsp;you
        </p>
      </div>
    </div>
  );
}
