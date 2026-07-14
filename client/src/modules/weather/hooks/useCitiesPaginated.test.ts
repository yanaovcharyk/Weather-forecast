import { vi } from 'vitest';

import { useQueryMock } from '@/common/testing/mocks/apollo.mock';
import {
  KYIV_CITY_NODE_FIXTURE,
  LVIV_CITY_NODE_FIXTURE,
  createCitiesConnection,
  createCitiesPaginatedResponse,
} from '@/weather/testing/fixtures';
import {
  DEFAULT_CITIES_SORTING,
  NEXT_PAGE_SORTING,
  createCitiesFetchMoreMock,
  createEmptyCitiesResponse,
  loadMoreCities,
  setupCitiesPaginated,
  setupCitiesPaginatedQuery,
} from '@/weather/testing/setups/citiesPaginated.setup';

describe('useCitiesPaginated', () => {
  const fetchMore = createCitiesFetchMoreMock();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mapped cities', () => {
    setupCitiesPaginatedQuery({
      fetchMore,
      data: createCitiesPaginatedResponse(
        createCitiesConnection({
          nodes: [KYIV_CITY_NODE_FIXTURE, LVIV_CITY_NODE_FIXTURE],
        }),
      ),
    });

    const { result } = setupCitiesPaginated();

    expect(result.current.cities).toHaveLength(2);
    expect(result.current.hasNext).toBe(false);
    expect(useQueryMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        variables: {
          query: {
            pagination: {
              limit: 10,
              cursor: null,
            },
            sorting: {
              sortBy: 'CITY_NAME',
              sortOrder: 'ASC',
            },
            showPinnedOnly: false,
          },
        },
      }),
    );
  });

  it('returns empty cities array', () => {
    setupCitiesPaginatedQuery({
      fetchMore,
    });

    const { result } = setupCitiesPaginated();

    expect(result.current.cities).toEqual([]);
  });

  it('loads next page', async () => {
    setupCitiesPaginatedQuery({
      fetchMore,
      data: createEmptyCitiesResponse({
        hasNextPage: true,
        endCursor: 'cursor-1',
      }),
    });

    const { result } = setupCitiesPaginated({
      sorting: NEXT_PAGE_SORTING,
      showPinnedOnly: true,
    });

    await loadMoreCities(result);

    expect(fetchMore).toHaveBeenCalledWith({
      variables: {
        query: {
          pagination: {
            limit: 10,
            cursor: 'cursor-1',
          },
          sorting: {
            sortBy: 'CREATED_AT',
            sortOrder: 'DESC',
          },
          showPinnedOnly: true,
        },
      },
    });
  });

  it('loads next page with null cursor when end cursor is missing', async () => {
    setupCitiesPaginatedQuery({
      fetchMore,
      data: createEmptyCitiesResponse({
        hasNextPage: true,
      }),
    });

    const { result } = setupCitiesPaginated({
      sorting: NEXT_PAGE_SORTING,
      showPinnedOnly: true,
    });

    await loadMoreCities(result);

    expect(fetchMore).toHaveBeenCalledWith({
      variables: {
        query: {
          pagination: {
            limit: 10,
            cursor: null,
          },
          sorting: {
            sortBy: 'CREATED_AT',
            sortOrder: 'DESC',
          },
          showPinnedOnly: true,
        },
      },
    });
  });

  it('does not load more when no next page', async () => {
    setupCitiesPaginatedQuery({
      fetchMore,
      data: createEmptyCitiesResponse(),
    });

    const { result } = setupCitiesPaginated({
      sorting: DEFAULT_CITIES_SORTING,
      showPinnedOnly: false,
    });

    await loadMoreCities(result);

    expect(fetchMore).not.toHaveBeenCalled();
  });
});
