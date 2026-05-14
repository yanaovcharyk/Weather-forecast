import { useMutation } from '@apollo/client/react';

import { REMOVE_ALL_CITIES } from '../api/weatherApi';

type RemoveAllCitiesMutation = {
  removeAllCities: boolean;
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
        ok: data?.removeAllCities === true,
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
