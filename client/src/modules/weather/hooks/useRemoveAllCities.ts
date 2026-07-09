import { useMutation } from '@apollo/client/react';

import { REMOVE_ALL_SAVED_CITIES } from '@/weather/graphql';
import { GraphQLTypename } from '@/weather/types';

type RemoveAllCitiesMutation = {
  removeAllSavedCities: boolean;
};

export const useRemoveAllCities = () => {
  const [mutate, { loading }] = useMutation<RemoveAllCitiesMutation>(
    REMOVE_ALL_SAVED_CITIES,
    {
      update(cache) {
        cache.modify({
          fields: {
            getSavedCitiesPaginated(existingConnection) {
              if (!existingConnection) {
                return existingConnection;
              }

              return {
                __typename: existingConnection.__typename,
                edges: [],
                pageInfo: {
                  __typename: GraphQLTypename.PageInfo,
                  hasNextPage: false,
                  endCursor: null,
                },
              };
            },
          },
        });
      },
    },
  );

  const removeAllCities = async () => {
    try {
      const { data } = await mutate();
      return {
        ok: data?.removeAllSavedCities === true,
        code: undefined,
      };
    } catch {
      return {
        ok: false,
        code: undefined,
      };
    }
  };

  return {
    removeAllCities,
    loading,
  };
};
