import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GetCarsParams } from '@/lib/api';

type CarFilterStore = {
  filters: GetCarsParams;
  setFilters: (filters: GetCarsParams) => void;
  clearFilters: () => void;
};

const initialDraft: GetCarsParams = {
  brand: '',
  price: undefined,
  minMileage: undefined,
  maxMileage: undefined,
};

export const useCarFilterStore = create<CarFilterStore>()(
  persist(
    set => ({
      filters: initialDraft,
      setFilters: filters => set({ filters }),
      clearFilters: () => set({ filters: initialDraft }),
    }),
    {
      name: 'car-filters',
      partialize: state => ({ filters: state.filters }),
    }
  )
);
