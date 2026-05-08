import { useMutation } from '@apollo/client/react';
import { GraphQLError } from 'graphql';
import { ADD_CITY_MUTATION } from '../api/weatherApi';
import type { AddCityMutation } from '@/common/types';

export const useAddCity = () => {
  const [mutate, { loading }] = useMutation<AddCityMutation>(ADD_CITY_MUTATION);

  const addCity = async (lat: number, lon: number, city: string) => {
    try {
      const { data } = await mutate({
        variables: { input: { lat, lon, city } },
        refetchQueries: ['CitiesPaginated'],
      });

      return {
        ok: data?.addCity.ok ?? false,
        code: data?.addCity.code,
        city: data?.addCity.city ?? null,
        existingCity: data?.addCity.existingCity ?? null,
      };
    } catch (error) {
      const gqlErrors = error as readonly GraphQLError[];

      const code = gqlErrors[0]?.extensions?.code as string | undefined;

      return {
        ok: false as const,
        code,
        city: null,
        existingCity: null,
      };
    }
  };

  return { addCity, loading };
};
