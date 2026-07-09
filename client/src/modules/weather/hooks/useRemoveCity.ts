import { useMutation } from '@apollo/client/react';
import { REMOVE_SAVED_CITY_MUTATION } from '@/weather/graphql';
import type {
  IRemoveCityMutation,
  IRemoveCityVariables,
} from '@/weather/types';
import { GraphQLTypename } from '@/weather/types';
import type { Reference } from '@apollo/client';

export const useRemoveCity = () => {
  const [mutate, { loading, error }] = useMutation<
    IRemoveCityMutation,
    IRemoveCityVariables
  >(REMOVE_SAVED_CITY_MUTATION, {
    update(cache, _, { variables }) {
      const deletedId = variables?.id;

      cache.modify({
        fields: {
          getSavedCitiesPaginated(
            existingConnection = { edges: [] },
            { readField },
          ) {
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
          __typename: GraphQLTypename.CityOutput,
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
