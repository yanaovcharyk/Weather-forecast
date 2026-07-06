import { useApolloClient } from '@apollo/client/react';
import { GET_SAVED_CITY } from '@/common/graphql';
import type { City } from '@/weatherForecast/types';

type SavedCityLookupQuery = {
  getSavedCity: City | null;
};

type SavedCityLookupVariables = {
  id?: string;
  cityName?: string;
  includeWeather?: boolean;
};

export const useSavedCityLookup = () => {
  const client = useApolloClient();

  const getSavedCity = async (
    variables: SavedCityLookupVariables,
  ): Promise<City | null> => {
    const { data } = await client.query<
      SavedCityLookupQuery,
      SavedCityLookupVariables
    >({
      query: GET_SAVED_CITY,
      variables,
      fetchPolicy: 'network-only',
    });

    return data?.getSavedCity ?? null;
  };

  return {
    getSavedCity,
  };
};
