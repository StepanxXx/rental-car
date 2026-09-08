export interface CarLocation {
  country: string;
  city: string;
  address: string;
}

export interface Car {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: string;
  engine: string;
  features: string[];
  rentalPrice: string;
  rentalCompany: string;
  location: CarLocation;
  rentalConditions: string[];
  mileage: number;
}

export type PriceRange = {
  min: number;
  max: number;
};

export type GetCarsParams = {
  brand?: string;
  price?: number;
  minMileage?: number;
  maxMileage?: number;
  perPage?: number;
  page?: number;
};

export type CarFilters = Pick<
  GetCarsParams,
  'brand' | 'price' | 'minMileage' | 'maxMileage'
>;

export interface CarsFiltersResponse {
  brands: string[];
  price: PriceRange;
}
