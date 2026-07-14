import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRemoveCity } from './useRemoveCity';
import {
  mockApolloMutation,
  useMutationMock,
} from '@/common/testing/mocks/apollo.mock';
import { GraphQLTypename } from '@/weather/types';

const mockMutate = vi.fn();

vi.mock('@/weather/graphql', () => ({
  REMOVE_SAVED_CITY_MUTATION: 'REMOVE_SAVED_CITY_MUTATION',
}));

describe('useRemoveCity', () => {
  const setup = () => {
    const { result } = renderHook(() => useRemoveCity());

    const removeCity = async (id = '123') => {
      await act(async () => {
        await result.current.removeCity(id);
      });
    };

    return {
      result,
      removeCity,
    };
  };

  const setupCacheUpdate = (id = '123') => {
    setup();

    const [, options] = useMutationMock.mock.calls[0];

    const cache = {
      modify: vi.fn(),
      evict: vi.fn(),
      identify: vi.fn(() => `CityOutput:${id}`),
    };

    options.update(
      cache,
      {},
      {
        variables: {
          id,
        },
      },
    );

    const modifyCall = cache.modify.mock.calls[0][0];

    return {
      cache,
      getSavedCitiesPaginated: modifyCall.fields.getSavedCitiesPaginated,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockApolloMutation({
      mutate: mockMutate,
    });
  });

  it('returns loading and error values', () => {
    const { result } = setup();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.removeCity).toBeDefined();
  });

  it('calls mutation with city id', async () => {
    mockMutate.mockResolvedValue({});

    const { removeCity } = setup();

    await removeCity('123');

    expect(mockMutate).toHaveBeenCalledWith({
      variables: {
        id: '123',
      },
    });
  });

  it('removes deleted city from cache', () => {
    const { cache, getSavedCitiesPaginated } = setupCacheUpdate();

    const existingConnection = {
      edges: [{ id: 'edge1' }, { id: 'edge2' }],
    };

    const readField = vi.fn((field, ref) => {
      if (field === 'node') {
        return ref.id === 'edge1' ? { id: '123' } : { id: '456' };
      }

      if (field === 'id') {
        return ref.id;
      }
    });

    const result = getSavedCitiesPaginated(existingConnection, { readField });

    expect(result.edges).toEqual([{ id: 'edge2' }]);

    expect(cache.identify).toHaveBeenCalledWith({
      __typename: GraphQLTypename.CityOutput,
      id: '123',
    });

    expect(cache.evict).toHaveBeenCalledWith({
      id: 'CityOutput:123',
    });
  });

  it('handles empty existing connection', () => {
    const { getSavedCitiesPaginated } = setupCacheUpdate();

    const result = getSavedCitiesPaginated(undefined, {
      readField: vi.fn(),
    });

    expect(result).toEqual({
      edges: [],
    });
  });
});
