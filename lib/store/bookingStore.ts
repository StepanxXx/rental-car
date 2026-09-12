import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookingRequestData } from '@/lib/api';

type CarBookingDraftStore = {
  draft: { [carId: string]: BookingRequestData };
  setDraft: (carId: string, bookingRequest: BookingRequestData) => void;
  clearDraft: (carId: string) => void;
};

const initialDraft: { [carId: string]: BookingRequestData } = {};

export const useCarBookingDraftStore = create<CarBookingDraftStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: (carId: string, bookingRequest: BookingRequestData) =>
        set(state => ({
          draft: { ...state.draft, [carId]: bookingRequest },
        })),
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
    }
  )
);
