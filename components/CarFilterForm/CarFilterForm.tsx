'use client';

import { useId } from 'react';
import { useCarFilterStore } from '@/lib/store/filterStore';
import type { CarFilters, CarsFiltersResponse } from '@/types/cars';

import css from './CarFilterForm.module.css';

type FilterKey = keyof CarFilters;

const toOptionalNumber = (value: string) => {
  if (!value || !value.trim()) return undefined;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const normalizeFilters = (filters: CarFilters): CarFilters => ({
  ...filters,
  brand: filters.brand?.trim() ?? '',
});

interface CarFilterFormProps {
  onSearch: (filters: CarFilters) => void;
  onClear: () => void;
  filtersOptions: CarsFiltersResponse;
}

const CarFilterForm = ({
  onSearch,
  onClear,
  filtersOptions: { brands: brandsList, price: priceRange },
}: CarFilterFormProps) => {
  const fieldId = useId();

  const priceList = [...Array(priceRange.max - priceRange.min + 1)]
    .map((_, index) => index + priceRange.min)
    .filter(num => num % 10 === 0);

  const setFilters = useCarFilterStore(state => state.setFilters);
  const filters = useCarFilterStore(state => state.filters);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const key = name as FilterKey;
    const nextFilters = {
      ...filters,
      [key]: key === 'brand' ? value : toOptionalNumber(value),
    };
    setFilters(nextFilters);
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;

    const values = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;
    const nextFilters = normalizeFilters({
      brand: values.brand,
      price: toOptionalNumber(values.price),
      minMileage: toOptionalNumber(values.minMileage),
      maxMileage: toOptionalNumber(values.maxMileage),
    });
    setFilters(nextFilters);
    onSearch(nextFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      brand: '',
      price: undefined,
      minMileage: undefined,
      maxMileage: undefined,
    });
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={css.filterForm}
      aria-label="Car filters"
    >
      <label
        id={`${fieldId}-brand-label`}
        className={css.label}
        htmlFor={`${fieldId}-brand`}
      >
        Car brand
        <span className={css.selectWrapper}>
          <select
            className={css.select}
            id={`${fieldId}-brand`}
            name="brand"
            value={filters.brand ?? ''}
            onChange={handleFilterChange}
            aria-label="Car brand"
          >
            <option value="" disabled hidden>
              Choose a brand
            </option>
            {brandsList.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <svg
            className={css.selectIcon}
            width="13"
            height="7"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/icons.svg#icon-chevron-up" />
          </svg>
        </span>
      </label>

      <label
        id={`${fieldId}-price-label`}
        className={css.label}
        htmlFor={`${fieldId}-price`}
      >
        Price/ 1 hour
        <span className={css.selectWrapper}>
          <select
            className={css.select}
            id={`${fieldId}-price`}
            name="price"
            value={filters.price?.toString() ?? ''}
            onChange={handleFilterChange}
            aria-label={`Car price ${priceRange.min} - ${priceRange.max}`}
          >
            <option value="" disabled hidden>
              Choose a price
            </option>
            {priceList.map(price => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>
          <svg
            className={css.selectIcon}
            width="13"
            height="7"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/icons.svg#icon-chevron-up" />
          </svg>
        </span>
      </label>
      <fieldset className={css.mileageContainer}>
        <legend className={css.legend}>Car mileage / km</legend>
        <div className={css.mileageInputContainer}>
          <label htmlFor={`${fieldId}-minMileage`} className="visually-hidden">
            From
          </label>
          <input
            className={css.input}
            id={`${fieldId}-minMileage`}
            type="number"
            name="minMileage"
            min="0"
            inputMode="numeric"
            aria-label="Minimum car mileage"
            value={filters.minMileage ?? ''}
            onChange={handleFilterChange}
            placeholder="From"
          />

          <label htmlFor={`${fieldId}-maxMileage`} className="visually-hidden">
            To
          </label>
          <input
            className={css.input}
            id={`${fieldId}-maxMileage`}
            type="number"
            name="maxMileage"
            min="0"
            inputMode="numeric"
            aria-label="Maximum car mileage"
            value={filters.maxMileage ?? ''}
            onChange={handleFilterChange}
            placeholder="To"
          />
        </div>
      </fieldset>

      <button type="submit" className={css.submitBtn}>
        Search
      </button>
      <button
        type="button"
        onClick={handleClearFilters}
        className={css.clearBtn}
      >
        Clear filters
      </button>
    </form>
  );
};

export default CarFilterForm;
