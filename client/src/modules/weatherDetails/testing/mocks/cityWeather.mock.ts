import type { CityWeatherResult } from '@/weatherDetails/hooks/useCityWeather';
import { createWeather } from '@/weatherDetails/testing/fixtures';

export const createCityWeatherState = (
  overrides: Partial<CityWeatherResult> = {},
): CityWeatherResult => ({
  cityName: 'Kyiv',
  weather: createWeather(),
  loading: false,
  error: undefined,
  ...overrides,
});
