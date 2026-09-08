'use client';

import { useId } from 'react';
import { useCarFilterStore } from '@/lib/store/filterStore';
import type { CarFilters, CarsFiltersResponse } from '@/types/cars';

import css from './CarFilterForm.module.css';

type FilterKey = keyof CarFilters;

const toOptionalNumber = (value: string) => {
  if (!value.trim()) return undefined;

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
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

    const formData = new FormData(form);
    const values = Object.fromEntries(formData) as CarFilters;

    const nextFilters = normalizeFilters(values);
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
    <form onSubmit={handleSubmit} noValidate className={css.filterForm}>
      <label className={css.label}>
        Car brand
        <select
          className={css.select}
          id={`${fieldId}-brand`}
          name="brand"
          value={filters.brand ?? ''}
          onChange={handleFilterChange}
        >
          <option value="">Choose a brand</option>
          {brandsList.map(brand => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>

      <label className={css.label}>
        Price/ 1 hour
        <select
          className={css.select}
          id={`${fieldId}-price`}
          name="price"
          value={filters.price ?? ''}
          onChange={handleFilterChange}
        >
          <option value="">Choose price</option>
          {priceList.map(price => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </select>
      </label>
      <fieldset className={css.mileageContainer}>
        <legend className={css.legend}>Сar mileage / km</legend>
        <div className={css.mileageInputContainer}>
          <label htmlFor={`${fieldId}-minMileage`}>From</label>
          <input
            className={css.input}
            id={`${fieldId}-minMileage`}
            type="number"
            name="minMileage"
            min="0"
            value={filters.minMileage ?? ''}
            onChange={handleFilterChange}
          />

          <label className={css.label} htmlFor={`${fieldId}-maxMileage`}>
            To
          </label>
          <input
            className={css.input}
            id={`${fieldId}-maxMileage`}
            type="number"
            name="maxMileage"
            min="0"
            value={filters.maxMileage ?? ''}
            onChange={handleFilterChange}
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
