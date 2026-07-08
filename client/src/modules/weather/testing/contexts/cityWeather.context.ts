import type { ErrorLike } from '@apollo/client';
import type {
  GetSavedCityResponse,
  GetWeatherDetailsResponse,
} from '@/weather/types';

export type CityWeatherContext = {
  id: string;

  cityData?: GetSavedCityResponse;
  weatherData?: GetWeatherDetailsResponse;

  cityLoading: boolean;
  weatherLoading: boolean;

  cityError: ErrorLike | undefined;
  weatherError: ErrorLike | undefined;
};

export const createCityWeatherContext = (
  overrides: Partial<CityWeatherContext> = {},
): CityWeatherContext => ({
  id: '1',

  cityData: undefined,
  weatherData: undefined,

  cityLoading: false,
  weatherLoading: false,

  cityError: undefined,
  weatherError: undefined,

  ...overrides,
});
