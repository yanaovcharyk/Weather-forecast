import { useMutation } from '@apollo/client/react';
import { ADD_CITY_MUTATION } from '@/weatherForecast/graphql';
import type { City } from '@/weatherForecast/types';

type AddCityMutation = {
  addCity: City;
};

export const useAddCity = () => {
  const [mutate, { loading }] = useMutation<AddCityMutation>(
    ADD_CITY_MUTATION,
    {
      update(cache, { data }) {
        if (!data?.addCity) {
          return;
        }

        cache.evict({
          fieldName: 'citiesPaginated',
        });

        cache.gc();
      },
    },
  );

  const addCity = async (
    lat: number,
    lon: number,
    city: string,
  ): Promise<City | null> => {
    const { data } = await mutate({
      variables: {
        input: { lat, lon, city },
      },
    });

    return data?.addCity ?? null;
  };

  return {
    addCity,
    loading,
  };
};
