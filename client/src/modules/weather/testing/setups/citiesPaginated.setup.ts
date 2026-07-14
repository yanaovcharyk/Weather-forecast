import { act, renderHook } from '@testing-library/react';
import type { useQuery } from '@apollo/client/react';
import { vi } from 'vitest';

import { mockApolloQuery } from '@/common/testing/mocks/apollo.mock';
import {
  createCitiesConnection,
  createCitiesPaginatedResponse,
} from '@/weather/testing/fixtures';
import { useCitiesPaginated } from '@/weather/hooks/useCitiesPaginated';
import { CitySortField, CitySortOrder } from '@/weather/types';
import type { CitiesPaginatedResponse, SortingState } from '@/weather/types';

export const DEFAULT_CITIES_SORTING: SortingState = {
  sortBy: CitySortField.CityName,
  sortOrder: CitySortOrder.Asc,
};

export const NEXT_PAGE_SORTING: SortingState = {
  sortBy: CitySortField.CreatedAt,
  sortOrder: CitySortOrder.Desc,
};

type CitiesPaginatedFetchMore = NonNullable<
  useQuery.Result<CitiesPaginatedResponse>['fetchMore']
>;

type CitiesPaginatedFetchMoreMock = ReturnType<typeof vi.fn> &
  CitiesPaginatedFetchMore;

export const createCitiesFetchMoreMock = (): CitiesPaginatedFetchMoreMock =>
  vi.fn() as unknown as CitiesPaginatedFetchMoreMock;

export const setupCitiesPaginatedQuery = ({
  fetchMore,
  data,
}: {
  fetchMore: CitiesPaginatedFetchMoreMock;
  data?: CitiesPaginatedResponse;
}) =>
  mockApolloQuery({
    fetchMore,
    data,
  });

export const setupCitiesPaginated = ({
  sorting = DEFAULT_CITIES_SORTING,
  showPinnedOnly = false,
}: {
  sorting?: SortingState;
  showPinnedOnly?: boolean;
} = {}) => renderHook(() => useCitiesPaginated(sorting, showPinnedOnly));

export const loadMoreCities = async (
  result: ReturnType<typeof setupCitiesPaginated>['result'],
) => {
  await act(async () => {
    await result.current.loadMore();
  });
};

export const createEmptyCitiesResponse = ({
  hasNextPage = false,
  endCursor,
}: {
  hasNextPage?: boolean;
  endCursor?: string;
} = {}) =>
  createCitiesPaginatedResponse(
    createCitiesConnection({
      hasNextPage,
      endCursor,
    }),
  );
