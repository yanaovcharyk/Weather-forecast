import { useMutation } from '@apollo/client/react';
import { ADD_CITY_MUTATION } from '../graphql';
import type { City } from '../types';

type AddCityMutation = {
  addCity: {
    ok: boolean;
    code?: string;
    city: City | null;
    existingCity: City | null;
  };
};

export const useAddCity = () => {
  const [mutate, { loading }] = useMutation<AddCityMutation>(
    ADD_CITY_MUTATION,
    {
      update(cache, { data }) {
        const addedCity = data?.addCity?.city;

        if (!addedCity) {
          return;
        }

        cache.evict({
          fieldName: 'citiesPaginated',
        });
      },
    },
  );

  const addCity = async (lat: number, lon: number, city: string) => {
    const { data } = await mutate({
      variables: {
        input: { lat, lon, city },
      },
    });

    return {
      ok: data?.addCity.ok ?? false,
      code: data?.addCity.code,
      city: data?.addCity.city ?? null,
      existingCity: data?.addCity.existingCity ?? null,
    };
  };

  return {
    addCity,
    loading,
  };
};
