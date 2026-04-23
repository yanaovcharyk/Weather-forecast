import type { AddCityMutation, CitiesQuery } from '@/shared/types';
import { ADD_CITY_MUTATION, CITIES_QUERY } from '../api';
import { useApolloClient, useMutation } from '@apollo/client/react';

export const useAddCity = () => {
  const client = useApolloClient();
  const [mutate, { loading }] = useMutation<AddCityMutation>(ADD_CITY_MUTATION);

  const normalizeCityKey = (key: string) => key.trim().toLowerCase();

  const getCachedCities = () => {
    const cache = client.readQuery<CitiesQuery>({
      query: CITIES_QUERY,
    });

    return cache?.cities ?? [];
  };

  const validateCityKey = (cityKey: string) => {
    const normalized = normalizeCityKey(cityKey);

    if (!normalized) {
      return { ok: false as const, code: 'INVALID_CITY' as const };
    }

    return { ok: true as const, normalized };
  };

  const performAddCityMutation = async (city: string) => {
    return mutate({
      variables: { input: { city } },
      update(cache, { data }) {
        if (!data?.addCity) return;

        const existing = cache.readQuery<CitiesQuery>({
          query: CITIES_QUERY,
        });

        if (!existing) {
          return;
        }

        cache.writeQuery({
          query: CITIES_QUERY,
          data: {
            cities: [data.addCity, ...existing.cities],
          },
        });
      },
    });
  };

  const addCity = async (cityKey: string) => {
    const validation = validateCityKey(cityKey);

    if (!validation.ok) {
      return { ok: false, code: validation.code };
    }

    const normalizedCity = validation.normalized;
    const existingCities = getCachedCities();

    if (existingCities.some((c) => c.city.toLowerCase() === normalizedCity)) {
      return { ok: false, code: 'CITY_EXISTS' as const };
    }

    if (existingCities.length >= 10) {
      return { ok: false, code: 'CITY_LIMIT' as const };
    }

    const result = await performAddCityMutation(normalizedCity);

    if (!result.data?.addCity) {
      return { ok: false, code: 'INVALID_CITY' as const };
    }

    return { ok: true as const };
  };

  return { addCity, loading };
};
