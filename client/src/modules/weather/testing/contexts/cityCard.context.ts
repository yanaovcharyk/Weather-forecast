import type { Mock } from 'vitest';

import type { City } from '@/weather/types';
import { CITY_FIXTURE, WEATHER_FIXTURE } from '@/weather/testing/fixtures';

export type CityCardRuntimeMocks = {
  navigate: Mock;
  searchParams: URLSearchParams;
  setSearchParams: Mock;
  removeCity: Mock;
  togglePinned: Mock;
};

export const CITY_CARD_WITH_WEATHER_FIXTURE: City = {
  ...CITY_FIXTURE,
  weather: WEATHER_FIXTURE,
};

export const CITY_CARD_WITHOUT_WEATHER_FIXTURE: City = {
  ...CITY_FIXTURE,
  weather: null,
};
