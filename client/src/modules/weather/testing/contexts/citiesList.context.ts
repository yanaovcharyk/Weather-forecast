import type { Mock } from 'vitest';

import type { CityCardProps } from '@/weather/components/CityCard/CityCard';
import type { City } from '@/weather/types';

export type CitiesListRuntimeMocks = {
  navigate: Mock;
  useCitiesPaginated: Mock;
  useSortingParams: Mock;
  toast: {
    toast: Mock;
    success: Mock;
    error: Mock;
    info: Mock;
    warning: Mock;
  };
  searchParams: URLSearchParams;
  setSearchParams: Mock;
  cityCardProps: CityCardProps[];
};

export const CITIES_LIST_CITY_FIXTURE: City = {
  id: '1',
  cityName: 'Kyiv',
  weather: null,
  isPinned: false,
  lat: 50.45,
  lon: 30.52,
};

export const CITIES_LIST_EXTRA_CITY_FIXTURE: City = {
  id: '2',
  cityName: 'Lviv',
  weather: null,
  isPinned: false,
  lat: 49.84,
  lon: 24.03,
};
