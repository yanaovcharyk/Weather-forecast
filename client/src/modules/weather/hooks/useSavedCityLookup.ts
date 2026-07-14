import { useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { GET_SAVED_CITY } from '@/common/graphql';
import type { City } from '@/weather/types';

type SavedCityLookupQuery = {
  getSavedCity: City | null;
};

type SavedCityLookupVariables = {
  id?: string;
  cityName?: string;
  includeWeather?: boolean;
};

export const useSavedCityLookup = () => {
  const [fetchSavedCity] = useLazyQuery<
    SavedCityLookupQuery,
    SavedCityLookupVariables
  >(GET_SAVED_CITY, {
    fetchPolicy: 'network-only',
  });

  const getSavedCity = useCallback(
    async (variables: SavedCityLookupVariables): Promise<City | null> => {
      const { data } = await fetchSavedCity({
        variables,
      });

      return data?.getSavedCity ?? null;
    },
    [fetchSavedCity],
  );

  return {
    getSavedCity,
  };
};
