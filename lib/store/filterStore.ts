import { create } from 'zustand';
import type { CarFilters, CarsFiltersResponse } from '@/types/cars';

type CarFilterStore = {
  filters: CarFilters;
  filtersOptions: CarsFiltersResponse;
  setFiltersOptions: (filtersOptions: CarsFiltersResponse) => void;
  setFilters: (filters: CarFilters) => void;
  clearFilters: () => void;
};

const initialFilters: CarFilters = {
  brand: '',
  price: undefined,
  minMileage: undefined,
  maxMileage: undefined,
};

const initialFiltersOptions: CarsFiltersResponse = {
  brands: [],
  price: { min: 0, max: 0 },
};

export const useCarFilterStore = create<CarFilterStore>()(set => ({
  filtersOptions: initialFiltersOptions,
  setFiltersOptions: filtersOptions => set({ filtersOptions }),
  filters: initialFilters,
  setFilters: filters => set({ filters }),
  clearFilters: () => set({ filters: initialFilters }),
}));
