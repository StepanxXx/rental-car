import type { CarFilters, CarsFiltersResponse, PriceRange } from '@/types/cars';

export const CAR_FILTER_KEYS = [
  'brand',
  'price',
  'minMileage',
  'maxMileage',
] as const satisfies readonly (keyof CarFilters)[];

export const EMPTY_CAR_FILTERS: CarFilters = {
  brand: '',
  price: undefined,
  minMileage: undefined,
  maxMileage: undefined,
};

export const EMPTY_FILTER_OPTIONS: CarsFiltersResponse = {
  brands: [],
  price: { min: 0, max: 0 },
};

type SearchParamValue = string | string[] | number | null | undefined;

export type CarFilterSearchParams = Partial<
  Record<(typeof CAR_FILTER_KEYS)[number], SearchParamValue>
>;

type SearchParamsSource = CarFilterSearchParams | Pick<URLSearchParams, 'get'>;

export const toOptionalNumber = (value: SearchParamValue) => {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  if (
    normalizedValue === null ||
    normalizedValue === undefined ||
    String(normalizedValue).trim() === ''
  ) {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const readSearchParam = (
  source: SearchParamsSource,
  key: (typeof CAR_FILTER_KEYS)[number]
) => {
  if ('get' in source) {
    return source.get(key);
  }

  return source[key];
};

export const parseCarFilters = (source: SearchParamsSource): CarFilters => {
  const rawBrand = readSearchParam(source, 'brand');
  const brand = Array.isArray(rawBrand) ? rawBrand[0] : rawBrand;

  return {
    brand: brand === null || brand === undefined ? '' : String(brand).trim(),
    price: toOptionalNumber(readSearchParam(source, 'price')),
    minMileage: toOptionalNumber(readSearchParam(source, 'minMileage')),
    maxMileage: toOptionalNumber(readSearchParam(source, 'maxMileage')),
  };
};

export const filtersToSearchParams = (
  filters: CarFilters,
  currentSearchParams = ''
) => {
  const params = new URLSearchParams(currentSearchParams);

  CAR_FILTER_KEYS.forEach(key => {
    const value = filters[key];

    if (value === undefined || value === '') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  return params;
};

export const createPriceOptions = ({ min, max }: PriceRange) => {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) return [];

  const firstPrice = Math.ceil(min / 10) * 10;
  const optionsCount = Math.floor((max - firstPrice) / 10) + 1;

  return optionsCount > 0
    ? Array.from(
        { length: optionsCount },
        (_, index) => firstPrice + index * 10
      )
    : [];
};
