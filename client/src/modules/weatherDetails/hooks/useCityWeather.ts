import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';

import type {
  GetCityByIdResponse,
  GetWeatherDetailsResponse,
} from '@/weatherDetails/types';

import { GET_CITY_BY_ID, GET_WEATHER_DETAILS } from '@/weatherDetails/graphql';

export type CityWeatherResult = {
  city: GetCityByIdResponse['city']['city'] | undefined;
  weather: GetWeatherDetailsResponse['getWeatherDetails'] | undefined;
  loading: boolean;
  error: Error | undefined;
};

export const useCityWeather = (): CityWeatherResult => {
  const { id } = useParams();

  const {
    data: cityData,
    loading: cityLoading,
    error: cityError,
  } = useQuery<GetCityByIdResponse>(GET_CITY_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const lat = cityData?.city?.lat;
  const lon = cityData?.city?.lon;

  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
  } = useQuery<GetWeatherDetailsResponse>(GET_WEATHER_DETAILS, {
    variables: lat && lon ? { input: { lat, lon } } : undefined,
    skip: !lat || !lon,
    fetchPolicy: 'network-only',
  });

  return {
    city: cityData?.city.city,
    weather: weatherData?.getWeatherDetails,
    loading: cityLoading || weatherLoading,
    error: cityError || weatherError,
  };
};
