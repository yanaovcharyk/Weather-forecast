import type { AddCityMutation, CitiesQuery } from '@/modules/common/types';
import { ADD_CITY_MUTATION, CITIES_QUERY } from '../api';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { CityService } from '../services/CityService';

export const useAddCity = () => {
  const client = useApolloClient();
  const [mutate, { loading }] = useMutation<AddCityMutation>(ADD_CITY_MUTATION);

  const getCachedCities = () => {
    const cache = client.readQuery<CitiesQuery>({
      query: CITIES_QUERY,
    });

    return cache?.cities ?? [];
  };

  const performAddCityMutation = async (city: string) => {
    return mutate({
      variables: { input: { city } },

      refetchQueries: [{ query: CITIES_QUERY }],
    });
  };

  const addCity = async (input: string) => {
    const cities = getCachedCities();

    const validation = CityService.validateBeforeAdd(input, cities);

    if (!validation.ok) {
      return validation;
    }

    const result = await performAddCityMutation(validation.city);

    if (!result.data?.addCity) {
      return { ok: false, code: 'INVALID_CITY' as const };
    }

    return { ok: true as const };
  };

  return { addCity, loading };
};
