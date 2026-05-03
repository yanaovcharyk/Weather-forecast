import type { AddCityMutation } from '@/common/types';
import { ADD_CITY_MUTATION, CITIES_QUERY } from '../api';
import { useMutation } from '@apollo/client/react';

export const useAddCity = () => {
  const [mutate, { loading }] = useMutation<AddCityMutation>(ADD_CITY_MUTATION);

  const performAddCityMutation = async (
    lat: number,
    lon: number,
    city: string,
  ) => {
    return mutate({
      variables: {
        input: {
          lat,
          lon,
          city,
        },
      },
      refetchQueries: [{ query: CITIES_QUERY }],
    });
  };

  const addCity = async (lat: number, lon: number, city: string) => {
    const result = await performAddCityMutation(lat, lon, city);

    if (!result.data?.addCity) {
      return { ok: false as const };
    }

    return { ok: true as const };
  };

  return { addCity, loading };
};
