import { useApolloClient } from '@apollo/client/react';
import { GET_EXISTS_CITY_BY_NAME } from '@/weatherForecast/graphql';
import type { City } from '@/weatherForecast/types';

type GetCityByNameQuery = {
  cityByName: City | null;
};

export const useCityByName = () => {
  const client = useApolloClient();

  const getCityByName = async (cityName: string): Promise<City | null> => {
    const { data } = await client.query<GetCityByNameQuery>({
      query: GET_EXISTS_CITY_BY_NAME,
      variables: {
        cityName,
      },
      fetchPolicy: 'network-only',
    });

    return data?.cityByName ?? null;
  };

  return {
    getCityByName,
  };
};
