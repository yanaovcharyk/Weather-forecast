import { renderHook, act } from '@testing-library/react';
import { useQuery } from '@apollo/client/react';
import { vi } from 'vitest';

import { useCitiesPaginated } from './useCitiesPaginated';
import { createQueryResult } from '@/common/testing/factories';

vi.mock('@apollo/client/react');

describe('useCitiesPaginated', () => {
  const fetchMore = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mapped cities', () => {
    vi.mocked(useQuery).mockReturnValue(
      createQueryResult({
        fetchMore,
        data: {
          getSavedCitiesPaginated: {
            edges: [
              {
                node: {
                  id: '1',
                  cityName: 'Kyiv',
                },
              },
              {
                node: {
                  id: '2',
                  cityName: 'Lviv',
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
            },
          },
        },
      }) as never,
    );

    const { result } = renderHook(() =>
      useCitiesPaginated(
        {
          sortBy: 'cityName',
          sortOrder: 'ASC',
        },
        false,
      ),
    );

    expect(result.current.cities).toHaveLength(2);
    expect(result.current.hasNext).toBe(false);
    expect(useQuery).toHaveBeenCalledWith(
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
    vi.mocked(useQuery).mockReturnValue(
      createQueryResult({
        fetchMore,
      }) as never,
    );

    const { result } = renderHook(() =>
      useCitiesPaginated(
        {
          sortBy: 'cityName',
          sortOrder: 'ASC',
        },
        false,
      ),
    );

    expect(result.current.cities).toEqual([]);
  });

  it('loads next page', async () => {
    vi.mocked(useQuery).mockReturnValue(
      createQueryResult({
        fetchMore,
        data: {
          getSavedCitiesPaginated: {
            edges: [],
            pageInfo: {
              hasNextPage: true,
              endCursor: 'cursor-1',
            },
          },
        },
      }) as never,
    );

    const { result } = renderHook(() =>
      useCitiesPaginated(
        {
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        },
        true,
      ),
    );

    await act(async () => {
      await result.current.loadMore();
    });

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

  it('does not load more when no next page', async () => {
    vi.mocked(useQuery).mockReturnValue(
      createQueryResult({
        fetchMore,
        data: {
          getSavedCitiesPaginated: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
            },
          },
        },
      }) as never,
    );

    const { result } = renderHook(() =>
      useCitiesPaginated(
        {
          sortBy: 'cityName',
          sortOrder: 'ASC',
        },
        false,
      ),
    );

    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchMore).not.toHaveBeenCalled();
  });
});
