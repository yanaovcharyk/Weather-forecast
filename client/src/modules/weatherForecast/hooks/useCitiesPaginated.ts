import { useCallback } from 'react';
import { CITIES_PAGINATED } from '../api/weatherApi';
import type { City } from '../../common/types';
import { useQuery } from '@apollo/client/react';

type CitiesQuery = {
  citiesPaginated: {
    edges: { node: City }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
};

type Sorting = {
  sortBy: 'city' | 'createdAt';
  sortOrder: 'ASC' | 'DESC';
};

export const useCitiesPaginated = (
  sorting: Sorting,
  showPinnedOnly: boolean,
) => {
  const { data, loading, fetchMore } = useQuery<CitiesQuery>(CITIES_PAGINATED, {
    variables: {
      query: {
        pagination: { limit: 10, cursor: null },
        sorting,
        showPinnedOnly,
      },
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const loadMore = useCallback(() => {
    const pageInfo = data?.citiesPaginated?.pageInfo;
    if (!pageInfo?.hasNextPage) return;

    return fetchMore({
      variables: {
        query: {
          pagination: { limit: 10, cursor: pageInfo.endCursor },
          sorting,
          showPinnedOnly,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          citiesPaginated: {
            ...fetchMoreResult.citiesPaginated,
            edges: [
              ...prev.citiesPaginated.edges,
              ...fetchMoreResult.citiesPaginated.edges,
            ],
          },
        };
      },
    });
  }, [data, fetchMore, sorting, showPinnedOnly]);

  return {
    cities: data?.citiesPaginated?.edges.map((e) => e.node) ?? [],
    loading,
    loadMore,
    hasNext: data?.citiesPaginated?.pageInfo?.hasNextPage ?? false,
  };
};
