import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { BookingRequestData } from '@/lib/api';

type CarBookingDraftStore = {
  draft: { [carId: string]: BookingRequestData };
  setDraftKey: (
    carId: string,
    key: keyof BookingRequestData,
    value: string
  ) => void;
  clearDraft: (carId: string) => void;
};

const initialDraft: BookingRequestData = {
  name: '',
  email: '',
  comment: '',
};

export const useCarBookingDraftStore = create<CarBookingDraftStore>()(
  devtools(
    persist(
      set => ({
        draft: {},
        setDraftKey: (
          carId: string,
          key: keyof BookingRequestData,
          value: string
        ) =>
          set(state => {
            const currentDraft = state.draft[carId] || initialDraft;

            return {
              draft: {
                ...state.draft,
                [carId]: { ...currentDraft, [key]: value },
              },
            };
          }),
        clearDraft: (carId: string) =>
          set(state => {
            const next = { ...state.draft };
            delete next[carId];
            return { draft: next };
          }),
      }),
      {
        name: 'car-booking-draft',
        partialize: state => ({ draft: state.draft }),
      } // persisted key in localStorage
    ),
    { name: 'car-booking-draft' } // devtools store name
  )
);
