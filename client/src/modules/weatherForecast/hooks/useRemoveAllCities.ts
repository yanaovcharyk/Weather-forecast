import { useMutation } from '@apollo/client/react';
import { GraphQLError } from 'graphql';

import { REMOVE_ALL_CITIES } from '../api/weatherApi';

type RemoveAllCitiesMutation = {
  removeAllCities: {
    ok: boolean;
    code?: string;
  };
};

export const useRemoveAllCities = () => {
  const [mutate, { loading }] = useMutation<RemoveAllCitiesMutation>(
    REMOVE_ALL_CITIES,
    {
      update(cache) {
        cache.modify({
          fields: {
            citiesPaginated(existingConnection) {
              if (!existingConnection) {
                return existingConnection;
              }

              return {
                __typename: existingConnection.__typename,

                edges: [],

                pageInfo: {
                  __typename: 'PageInfo',

                  hasNextPage: false,

                  endCursor: null,
                },
              };
            },
          },
        });

        cache.gc();
      },
    },
  );

  const removeAllCities = async () => {
    try {
      const { data } = await mutate();

      return {
        ok: data?.removeAllCities.ok ?? false,

        code: data?.removeAllCities.code,
      };
    } catch (error) {
      const gqlErrors = error as readonly GraphQLError[];

      const code = gqlErrors[0]?.extensions?.code as string | undefined;

      return {
        ok: false as const,
        code,
      };
    }
  };

  return {
    removeAllCities,
    loading,
  };
};
