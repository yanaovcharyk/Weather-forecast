import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRemoveAllCities } from './useRemoveAllCities';
import {
  mockApolloMutation,
  useMutationMock,
} from '@/common/testing/mocks/apollo.mock';
import { GraphQLTypename } from '@/weather/types';

const mockMutate = vi.fn();

vi.mock('@/weather/graphql', () => ({
  REMOVE_ALL_SAVED_CITIES: 'REMOVE_ALL_SAVED_CITIES',
}));

describe('useRemoveAllCities', () => {
  const setup = () => {
    const { result } = renderHook(() => useRemoveAllCities());

    const removeAllCities = async () => {
      let response;

      await act(async () => {
        response = await result.current.removeAllCities();
      });

      return response;
    };

    return {
      result,
      removeAllCities,
    };
  };

  const setupCacheUpdate = () => {
    setup();

    const [, options] = useMutationMock.mock.calls[0];

    const cache = {
      modify: vi.fn(),
    };

    options.update(cache);

    const modifyCall = cache.modify.mock.calls[0][0];

    return {
      getSavedCitiesPaginated: modifyCall.fields.getSavedCitiesPaginated,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockApolloMutation({
      mutate: mockMutate,
    });
  });

  it('returns loading state', () => {
    const { result } = setup();

    expect(result.current.loading).toBe(false);
    expect(result.current.removeAllCities).toBeDefined();
  });

  it('returns ok=true when mutation succeeds', async () => {
    mockMutate.mockResolvedValue({
      data: {
        removeAllSavedCities: true,
      },
    });

    const { removeAllCities } = setup();

    const response = await removeAllCities();

    expect(mockMutate).toHaveBeenCalled();
    expect(response).toEqual({
      ok: true,
      code: undefined,
    });
  });

  it('returns ok=false when mutation returns false', async () => {
    mockMutate.mockResolvedValue({
      data: {
        removeAllSavedCities: false,
      },
    });

    const { removeAllCities } = setup();

    const response = await removeAllCities();

    expect(response).toEqual({
      ok: false,
      code: undefined,
    });
  });

  it('returns ok=false on mutation error', async () => {
    mockMutate.mockRejectedValue(new Error('Mutation failed'));

    const { removeAllCities } = setup();

    const response = await removeAllCities();

    expect(response).toEqual({
      ok: false,
      code: undefined,
    });
  });

  it('updates cache and clears cities', () => {
    const { getSavedCitiesPaginated } = setupCacheUpdate();

    const existingConnection = {
      __typename: GraphQLTypename.CitiesConnection,
      edges: [{ id: '1' }],
      pageInfo: {
        hasNextPage: true,
        endCursor: 'abc',
      },
    };

    const result = getSavedCitiesPaginated(existingConnection);

    expect(result).toEqual({
      __typename: GraphQLTypename.CitiesConnection,
      edges: [],
      pageInfo: {
        __typename: GraphQLTypename.PageInfo,
        hasNextPage: false,
        endCursor: null,
      },
    });
  });

  it('returns existing connection when undefined', () => {
    const { getSavedCitiesPaginated } = setupCacheUpdate();

    const result = getSavedCitiesPaginated(undefined);

    expect(result).toBeUndefined();
  });
});
