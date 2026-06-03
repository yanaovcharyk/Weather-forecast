import { useMutation } from '@apollo/client/react';
import { REMOVE_CITY_MUTATION } from '../graphql/queries';
import type { RemoveCityMutation, RemoveCityVariables } from '../types';
import type { Reference } from '@apollo/client';

export const useRemoveCity = () => {
  const [mutate, { loading, error }] = useMutation<
    RemoveCityMutation,
    RemoveCityVariables
  >(REMOVE_CITY_MUTATION, {
    update(cache, _, { variables }) {
      const deletedId = variables?.id;

      cache.modify({
        fields: {
          citiesPaginated(existingConnection = {}, { readField }) {
            return {
              ...existingConnection,

              edges: existingConnection.edges.filter((edgeRef: Reference) => {
                return (
                  readField('id', readField('node', edgeRef)) !== deletedId
                );
              }),
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
