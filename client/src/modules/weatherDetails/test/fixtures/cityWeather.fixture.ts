import type { CityWeatherResult } from '@/weatherDetails/hooks/useCityWeather';
import { createWeather } from './weather.fixture';

export const createCityWeatherState = (
  overrides: Partial<CityWeatherResult> = {},
): CityWeatherResult => ({
  city: 'Kyiv',
  weather: createWeather(),
  loading: false,
  error: undefined,
  ...overrides,
});
