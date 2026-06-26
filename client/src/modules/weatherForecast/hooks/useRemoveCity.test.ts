import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useRemoveCity } from './useRemoveCity';
import { createMutationResult } from '@/common/testing/factories';

const mockMutate = vi.fn();

const mockUseMutation = vi.fn();

vi.mock('@apollo/client/react', () => ({
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
}));

vi.mock('@/weatherForecast/graphql', () => ({
  REMOVE_CITY_MUTATION: 'REMOVE_CITY_MUTATION',
}));

describe('useRemoveCity', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMutation.mockReturnValue([mockMutate, createMutationResult()]);
  });

  it('should return loading and error values', () => {
    const { result } = renderHook(() => useRemoveCity());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.removeCity).toBeDefined();
  });

  it('should call mutate with id', async () => {
    mockMutate.mockResolvedValue({});

    const { result } = renderHook(() => useRemoveCity());

    await act(async () => {
      await result.current.removeCity('123');
    });

    expect(mockMutate).toHaveBeenCalledWith({
      variables: {
        id: '123',
      },
    });
  });

  it('should update cache and remove deleted city', () => {
    renderHook(() => useRemoveCity());

    const [, options] = mockUseMutation.mock.calls[0];

    const update = options.update;

    const cache = {
      modify: vi.fn(),
      evict: vi.fn(),
      identify: vi.fn(() => 'City:123'),
    };

    update(
      cache,
      {},
      {
        variables: {
          id: '123',
        },
      },
    );

    expect(cache.modify).toHaveBeenCalled();

    const modifyCall = cache.modify.mock.calls[0][0];

    const citiesPaginated = modifyCall.fields.citiesPaginated;

    const existingConnection = {
      edges: [{ id: 'edge1' }, { id: 'edge2' }],
    };

    const readField = vi.fn((field, ref) => {
      if (field === 'node') {
        if (ref.id === 'edge1') {
          return { id: '123' };
        }

        return { id: '456' };
      }

      if (field === 'id') {
        return ref.id;
      }
    });

    const result = citiesPaginated(existingConnection, { readField });

    expect(result.edges).toEqual([{ id: 'edge2' }]);

    expect(cache.identify).toHaveBeenCalledWith({
      __typename: 'City',
      id: '123',
    });

    expect(cache.evict).toHaveBeenCalledWith({
      id: 'City:123',
    });
  });

  it('should handle empty existingConnection', () => {
    renderHook(() => useRemoveCity());

    const [, options] = mockUseMutation.mock.calls[0];

    const update = options.update;

    const cache = {
      modify: vi.fn(),
      evict: vi.fn(),
      identify: vi.fn(() => 'City:123'),
    };

    update(
      cache,
      {},
      {
        variables: {
          id: '123',
        },
      },
    );

    const modifyCall = cache.modify.mock.calls[0][0];

    const citiesPaginated = modifyCall.fields.citiesPaginated;

    const result = citiesPaginated(undefined, {
      readField: vi.fn(),
    });

    expect(result).toEqual({
      edges: [],
    });
  });
});
