import type { CityWeatherResult } from '@/weatherDetails/hooks/useCityWeather';
import { createWeather } from '@/weatherDetails/test/fixtures';

export const createCityWeatherState = (
  overrides: Partial<CityWeatherResult> = {},
): CityWeatherResult => ({
  city: 'Kyiv',
  weather: createWeather(),
  loading: false,
  error: undefined,
  ...overrides,
});
