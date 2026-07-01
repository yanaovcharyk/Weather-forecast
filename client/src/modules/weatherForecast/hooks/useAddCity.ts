import { useMutation } from '@apollo/client/react';
import { ADD_SAVED_CITY_MUTATION } from '@/weatherForecast/graphql';
import type { City } from '@/weatherForecast/types';

export type AddCityMutation = {
  addSavedCity: City;
};

export type AddCityVariables = {
  input: {
    lat: number;
    lon: number;
    cityName: string;
  };
};

export const useAddCity = () => {
  const [mutate, { loading }] = useMutation<AddCityMutation, AddCityVariables>(
    ADD_SAVED_CITY_MUTATION,
    {
      update(cache, { data }) {
        if (!data?.addSavedCity) {
          return;
        }

        cache.evict({
          fieldName: 'getSavedCitiesPaginated',
        });

        cache.gc();
      },
    },
  );

  const addCity = async (
    lat: number,
    lon: number,
    cityName: string,
  ): Promise<City | null> => {
    const { data } = await mutate({
      variables: {
        input: { lat, lon, cityName },
      },
    });

    return data?.addSavedCity ?? null;
  };

  return {
    addCity,
    loading,
  };
};
