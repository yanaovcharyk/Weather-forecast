import { useApolloClient } from '@apollo/client/react';
import { GET_SAVED_CITY_BY_NAME } from '@/weatherForecast/graphql';
import type { City } from '@/weatherForecast/types';

type GetCityByNameQuery = {
  getSavedCityByName: City | null;
};

type GetCityByNameVariables = {
  cityName: string;
};

export const useCityByName = () => {
  const client = useApolloClient();

  const getCityByName = async (cityName: string): Promise<City | null> => {
    const { data } = await client.query<
      GetCityByNameQuery,
      GetCityByNameVariables
    >({
      query: GET_SAVED_CITY_BY_NAME,
      variables: {
        cityName,
      },
      fetchPolicy: 'network-only',
    });

    return data?.getSavedCityByName ?? null;
  };

  return {
    getCityByName,
  };
};
