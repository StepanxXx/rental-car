import { create } from 'zustand';
import type { CarFilters } from '@/types/cars';

type CarFilterStore = {
  filters: CarFilters;
  setFilters: (filters: CarFilters) => void;
  clearFilters: () => void;
};

const initialDraft: CarFilters = {
  brand: '',
  price: undefined,
  minMileage: undefined,
  maxMileage: undefined,
};

export const useCarFilterStore = create<CarFilterStore>()(set => ({
  filters: initialDraft,
  setFilters: filters => set({ filters }),
  clearFilters: () => set({ filters: initialDraft }),
}));
