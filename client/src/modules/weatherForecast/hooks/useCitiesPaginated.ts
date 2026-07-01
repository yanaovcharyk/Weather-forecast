import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';

import { GET_SAVED_CITIES_PAGINATED } from '@/weatherForecast/graphql';
import type {
  CitiesPaginatedVariables,
  CitiesQuerySorting,
  CitiesPaginatedResponse,
  SortingState,
} from '@/weatherForecast/types';

const CITY_SORT_FIELD_GRAPHQL_VALUES: Record<
  SortingState['sortBy'],
  CitiesQuerySorting['sortBy']
> = {
  cityName: 'CITY_NAME',
  createdAt: 'CREATED_AT',
};

const toCitiesQuerySorting = (sorting: SortingState): CitiesQuerySorting => ({
  ...sorting,
  sortBy: CITY_SORT_FIELD_GRAPHQL_VALUES[sorting.sortBy],
});

export const useCitiesPaginated = (
  sorting: SortingState,
  showPinnedOnly: boolean,
) => {
  const querySorting = useMemo(() => toCitiesQuerySorting(sorting), [sorting]);

  const { data, loading, fetchMore } = useQuery<
    CitiesPaginatedResponse,
    CitiesPaginatedVariables
  >(GET_SAVED_CITIES_PAGINATED, {
    variables: {
      query: {
        pagination: {
          limit: 10,
          cursor: null,
        },

        sorting: querySorting,
        showPinnedOnly,
      },
    },

    notifyOnNetworkStatusChange: true,

    fetchPolicy: 'cache-and-network',
  });

  const loadMore = useCallback(() => {
    const pageInfo = data?.getSavedCitiesPaginated?.pageInfo;

    if (!pageInfo?.hasNextPage) {
      return;
    }

    return fetchMore({
      variables: {
        query: {
          pagination: {
            limit: 10,
            cursor: pageInfo.endCursor ?? null,
          },

          sorting: querySorting,
          showPinnedOnly,
        },
      },
    });
  }, [data, fetchMore, querySorting, showPinnedOnly]);

  return {
    cities: data?.getSavedCitiesPaginated?.edges.map((edge) => edge.node) ?? [],
    loading,
    loadMore,
    hasNext: data?.getSavedCitiesPaginated?.pageInfo.hasNextPage ?? false,
  };
};
