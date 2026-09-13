import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { EMPTY_CAR_FILTERS, EMPTY_FILTER_OPTIONS } from '@/lib/carFilters';
import type { CarFilters, CarsFiltersResponse } from '@/types/cars';

type CarFilterStore = {
  filtersOptions: CarsFiltersResponse;
  setFiltersOptions: (filtersOptions: CarsFiltersResponse) => void;
  filters: CarFilters;
  setFilters: (filters: CarFilters) => void;
  clearFilters: () => void;
};

export const useCarFilterStore = create<CarFilterStore>()(
  devtools(
    set => ({
      filtersOptions: EMPTY_FILTER_OPTIONS,
      setFiltersOptions: filtersOptions => set({ filtersOptions }),
      filters: EMPTY_CAR_FILTERS,
      setFilters: filters => set({ filters }),
      clearFilters: () => set({ filters: EMPTY_CAR_FILTERS }),
    }),
    { name: 'carFilterStore' }
  )
);
