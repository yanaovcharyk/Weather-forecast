import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';

import type {
  GetSavedCityResponse,
  GetWeatherDetailsResponse,
} from '@/weather/types';

import { GET_SAVED_CITY } from '@/common/graphql';
import { GET_WEATHER_DETAILS } from '@/weather/graphql';

export type CityWeatherResult = {
  cityName: string | undefined;
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
  } = useQuery<GetSavedCityResponse>(GET_SAVED_CITY, {
    variables: { id, includeWeather: false },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const city = cityData?.getSavedCity;
  const cityName = city?.cityName;
  const lat = city?.lat;
  const lon = city?.lon;

  const shouldLoadWeather = lat != null && lon != null;

  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
  } = useQuery<GetWeatherDetailsResponse>(GET_WEATHER_DETAILS, {
    variables: shouldLoadWeather ? { input: { lat, lon } } : undefined,
    skip: !shouldLoadWeather,
    fetchPolicy: 'network-only',
  });

  const weather = weatherData?.getWeatherDetails;

  return {
    cityName,
    weather,
    loading: cityLoading || weatherLoading || !cityName || !weather,
    error: cityError || weatherError,
  };
};
