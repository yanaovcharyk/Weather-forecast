import { useMutation } from '@apollo/client/react';
import { REMOVE_CITY_MUTATION } from '../graphql';
import type { IRemoveCityMutation, IRemoveCityVariables } from '../types';
import type { Reference } from '@apollo/client';

export const useRemoveCity = () => {
  const [mutate, { loading, error }] = useMutation<
    IRemoveCityMutation,
    IRemoveCityVariables
  >(REMOVE_CITY_MUTATION, {
    update(cache, _, { variables }) {
      const deletedId = variables?.id;

      cache.modify({
        fields: {
          citiesPaginated(existingConnection = { edges: [] }, { readField }) {
            return {
              ...existingConnection,

              edges: existingConnection.edges.filter(
                (edgeRef: Reference) =>
                  readField('id', readField('node', edgeRef)) !== deletedId,
              ),
            };
          },
        },
      });

      cache.evict({
        id: cache.identify({
          __typename: 'City',
          id: deletedId,
        }),
      });
    },
  });

  const removeCity = async (id: string) => {
    await mutate({
      variables: { id },
    });
  };

  return {
    removeCity,
    loading,
    error,
  };
};
