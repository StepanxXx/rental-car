import axios from 'axios';
import { Car, PriceRange } from '@/types/cars';

const BASE_URL = process.env.NEXT_PUBLIC_CAR_RENTAL_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

export type GetCarsParams = {
  brand?: string;
  price?: number;
  minMileage?: number;
  maxMileage?: number;
  perPage?: number;
  page?: number;
};

export interface CarsListResponse {
  cars: Car[];
  totalCars: number;
  page: number;
  totalPages: number;
}

export const getCars = async ({
  brand,
  price,
  minMileage,
  maxMileage,
  perPage = 12,
  page = 1,
}: GetCarsParams): Promise<CarsListResponse> => {
  const response = await api.get<CarsListResponse>('/cars', {
    params: {
      ...(brand && { brand }),
      ...(price && { price }),
      ...(minMileage && { minMileage }),
      ...(maxMileage && { maxMileage }),
      perPage,
      page,
    },
  });
  return response.data;
};

export interface CarsFiltersResponse {
  brands: string[];
  price: PriceRange;
}

export const getCarsFilters = async (): Promise<CarsFiltersResponse> => {
  const response = await api.get<CarsFiltersResponse>('/cars/filters');
  return response.data;
};

export const getCarById = async (id: string): Promise<Car> => {
  const response = await api.get<Car>(`/cars/${id}`);
  return response.data;
};

export type BookingRequestData = {
  name: string;
  email: string;
  comment?: string;
};

export type BookingResponse = {
  message: string;
};

export const createBookingRequest = async (
  carId: string,
  data: BookingRequestData
): Promise<BookingResponse> => {
  const response = await api.post<BookingResponse>(
    `/cars/${carId}/booking-requests`,
    data
  );
  return response.data;
};
