import type { CityWeatherResult } from '@/weather/hooks/useCityWeather';
import { createWeather } from '@/weather/testing/fixtures';

export const createCityWeatherState = (
  overrides: Partial<CityWeatherResult> = {},
): CityWeatherResult => ({
  cityName: 'Kyiv',
  weather: createWeather(),
  loading: false,
  cityLoading: false,
  weatherLoading: false,
  error: undefined,
  ...overrides,
});
