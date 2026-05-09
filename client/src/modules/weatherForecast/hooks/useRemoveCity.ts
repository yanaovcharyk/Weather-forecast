import { useMutation } from '@apollo/client/react';
import { REMOVE_CITY_MUTATION } from '../api/weatherApi';
import type { RemoveCityMutation, RemoveCityVariables } from '../types';

type CityEdge = {
  node: {
    id: number;
  };
};

export const useRemoveCity = () => {
  const [mutate, { loading, error }] = useMutation<
    RemoveCityMutation,
    RemoveCityVariables
  >(REMOVE_CITY_MUTATION);

  const removeCity = async (id: number): Promise<void> => {
    await mutate({
      variables: { id },

      optimisticResponse: {
        removeCity: {
          __typename: 'City',
          id,
        },
      },

      update(cache) {
        cache.modify({
          fields: {
            citiesPaginated(existing) {
              if (!existing?.edges) {
                return existing;
              }

              return {
                ...existing,
                edges: existing.edges.filter(
                  (edge: CityEdge) => edge?.node?.id !== id,
                ),
              };
            },
          },
        });
      },

      refetchQueries: ['CitiesPaginated'],
    });
  };

  return {
    removeCity,
    loading,
    error,
  };
};
