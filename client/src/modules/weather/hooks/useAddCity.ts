import { useMutation } from '@apollo/client/react';
import { ADD_SAVED_CITY_MUTATION } from '@/weather/graphql';
import type { City, SelectedCity } from '@/weather/types';

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

  const addCity = async (city: SelectedCity): Promise<City | null> => {
    const { data } = await mutate({
      variables: {
        input: city,
      },
    });

    return data?.addSavedCity ?? null;
  };

  return {
    addCity,
    loading,
  };
};
