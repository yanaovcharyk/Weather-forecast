import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';

import type {
  GetSavedCityResponse,
  GetWeatherDetailsResponse,
} from '@/weatherDetails/types';

import { GET_SAVED_CITY } from '@/common/graphql';
import { GET_WEATHER_DETAILS } from '@/weatherDetails/graphql';

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

  const lat = cityData?.getSavedCity?.lat;
  const lon = cityData?.getSavedCity?.lon;

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
    cityName: cityData?.getSavedCity?.cityName,
    weather: weatherData?.getWeatherDetails,
    loading: cityLoading || weatherLoading,
    error: cityError || weatherError,
  };
};
