import { useCallback } from 'react';
import { useQuery } from '@apollo/client/react';

import { CITIES_PAGINATED } from '../graphql';
import type { City } from '@/common/types';
import type { SortingState } from '../types';

type CitiesQuery = {
  citiesPaginated: {
    edges: { node: City }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
};

export const useCitiesPaginated = (
  sorting: SortingState,
  showPinnedOnly: boolean,
) => {
  const { data, loading, fetchMore } = useQuery<CitiesQuery>(CITIES_PAGINATED, {
    variables: {
      query: {
        pagination: {
          limit: 10,
          cursor: null,
        },

        sorting,
        showPinnedOnly,
      },
    },

    notifyOnNetworkStatusChange: true,

    fetchPolicy: 'cache-and-network',
  });

  const loadMore = useCallback(() => {
    const pageInfo = data?.citiesPaginated?.pageInfo;

    if (!pageInfo?.hasNextPage) {
      return;
    }

    return fetchMore({
      variables: {
        query: {
          pagination: {
            limit: 10,
            cursor: pageInfo.endCursor,
          },

          sorting,
          showPinnedOnly,
        },
      },
    });
  }, [data, fetchMore, sorting, showPinnedOnly]);

  return {
    cities: data?.citiesPaginated?.edges.map((edge) => edge.node) ?? [],
    loading,
    loadMore,
    hasNext: data?.citiesPaginated?.pageInfo.hasNextPage ?? false,
  };
};
