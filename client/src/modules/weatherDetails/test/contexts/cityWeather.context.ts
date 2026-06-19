import type { ErrorLike } from '@apollo/client';
import type {
  GetCityByIdResponse,
  GetWeatherDetailsResponse,
} from '../../types';

export type CityWeatherContext = {
  id: string;

  cityData?: GetCityByIdResponse;
  weatherData?: GetWeatherDetailsResponse;

  cityLoading: boolean;
  weatherLoading: boolean;

  cityError: ErrorLike | undefined;
  weatherError: ErrorLike | undefined;
};

export const createCityWeatherContext = (): CityWeatherContext => ({
  id: '1',

  cityLoading: false,
  weatherLoading: false,

  cityError: undefined,
  weatherError: undefined,
});
