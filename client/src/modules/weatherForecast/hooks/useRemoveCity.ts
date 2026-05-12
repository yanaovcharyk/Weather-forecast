import { useMutation } from '@apollo/client/react';
import { REMOVE_CITY_MUTATION } from '../api/weatherApi';
import type { RemoveCityMutation, RemoveCityVariables } from '../types';

export const useRemoveCity = () => {
  const [mutate, { loading, error }] = useMutation<
    RemoveCityMutation,
    RemoveCityVariables
  >(REMOVE_CITY_MUTATION);

  const removeCity = async (id: number): Promise<void> => {
    await mutate({
      variables: { id },
      refetchQueries: ['CitiesPaginated'],
    });
  };

  return {
    removeCity,
    loading,
    error,
  };
};
