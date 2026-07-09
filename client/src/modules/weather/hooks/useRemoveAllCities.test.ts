import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useRemoveAllCities } from './useRemoveAllCities';
import { createMutationResult } from '@/common/testing/factories';
import { GraphQLTypename } from '@/weather/types';

const mockMutate = vi.fn();
const mockUseMutation = vi.fn();

vi.mock('@apollo/client/react', () => ({
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
}));

vi.mock('@/weather/graphql', () => ({
  REMOVE_ALL_SAVED_CITIES: 'REMOVE_ALL_SAVED_CITIES',
}));

describe('useRemoveAllCities', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMutation.mockReturnValue([mockMutate, createMutationResult()]);
  });

  it('should return loading state', () => {
    const { result } = renderHook(() => useRemoveAllCities());

    expect(result.current.loading).toBe(false);

    expect(result.current.removeAllCities).toBeDefined();
  });

  it('should return ok=true when mutation succeeds', async () => {
    mockMutate.mockResolvedValue({
      data: {
        removeAllSavedCities: true,
      },
    });

    const { result } = renderHook(() => useRemoveAllCities());

    let response;

    await act(async () => {
      response = await result.current.removeAllCities();
    });

    expect(mockMutate).toHaveBeenCalled();

    expect(response).toEqual({
      ok: true,
      code: undefined,
    });
  });

  it('should return ok=false when mutation returns false', async () => {
    mockMutate.mockResolvedValue({
      data: {
        removeAllSavedCities: false,
      },
    });

    const { result } = renderHook(() => useRemoveAllCities());

    let response;

    await act(async () => {
      response = await result.current.removeAllCities();
    });

    expect(response).toEqual({
      ok: false,
      code: undefined,
    });
  });

  it('should return ok=false on mutation error', async () => {
    mockMutate.mockRejectedValue(new Error('Mutation failed'));

    const { result } = renderHook(() => useRemoveAllCities());

    let response;

    await act(async () => {
      response = await result.current.removeAllCities();
    });

    expect(response).toEqual({
      ok: false,
      code: undefined,
    });
  });

  it('should update cache and clear cities', () => {
    renderHook(() => useRemoveAllCities());

    const [, options] = mockUseMutation.mock.calls[0];

    const update = options.update;

    const cache = {
      modify: vi.fn(),
    };

    update(cache);

    expect(cache.modify).toHaveBeenCalled();

    const modifyCall = cache.modify.mock.calls[0][0];

    const getSavedCitiesPaginated = modifyCall.fields.getSavedCitiesPaginated;

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

  it('should return existingConnection when undefined', () => {
    renderHook(() => useRemoveAllCities());

    const [, options] = mockUseMutation.mock.calls[0];

    const update = options.update;

    const cache = {
      modify: vi.fn(),
    };

    update(cache);

    const modifyCall = cache.modify.mock.calls[0][0];

    const getSavedCitiesPaginated = modifyCall.fields.getSavedCitiesPaginated;

    const result = getSavedCitiesPaginated(undefined);

    expect(result).toBe(undefined);
  });
});
