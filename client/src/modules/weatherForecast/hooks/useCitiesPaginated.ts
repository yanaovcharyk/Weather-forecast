import { useQuery } from '@apollo/client/react';
import { CITIES_PAGINATED } from '../api/weatherApi';
import type { City } from '../../common/types';

type CitiesQuery = {
  citiesPaginated: {
    edges: { node: City }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
};

export const useCitiesPaginated = (sorting: {
  sortBy: 'city' | 'createdAt';
  sortOrder: 'ASC' | 'DESC';
}) => {
  const { data, loading, fetchMore, refetch } = useQuery<CitiesQuery>(
    CITIES_PAGINATED,
    {
      variables: {
        pagination: { limit: 10 },
        sorting,
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  );

  const loadMore = async () => {
    const pageInfo = data?.citiesPaginated?.pageInfo;
    if (!pageInfo?.hasNextPage) return;

    return fetchMore({
      variables: {
        pagination: {
          limit: 10,
          cursor: pageInfo.endCursor,
        },
        sorting,
      },
    });
  };

  return {
    cities: data?.citiesPaginated?.edges?.map((e) => e.node) ?? [],
    loading,
    loadMore,
    hasNext: data?.citiesPaginated?.pageInfo?.hasNextPage ?? false,
    refetch,
  };
};
