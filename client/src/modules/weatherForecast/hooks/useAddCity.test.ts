import { renderHook, act } from '@testing-library/react';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { useMutation } from '@apollo/client/react';
import { useAddCity } from './useAddCity';

vi.mock('@apollo/client/react');

type City = {
  id: string;
  city: string;
};

type AddCityMutation = {
  addCity: City;
};

type MutationOptions = Parameters<typeof useMutation<AddCityMutation>>[1];

type UpdateFn = NonNullable<NonNullable<MutationOptions>['update']>;

describe('useAddCity', () => {
  const mutate = vi.fn();

  let updateFn!: UpdateFn;

  const cacheEvict = vi.fn();
  const cacheGc = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMutation).mockImplementation((_doc, options) => {
      if (options?.update) {
        updateFn = options.update;
      }

      const result: useMutation.Result<AddCityMutation> = {
        loading: false,
        data: undefined,
        error: undefined,
        called: false,
        client: {} as never,
        reset: vi.fn(),
      };

      return [mutate, result] as unknown as ReturnType<typeof useMutation>;
    });
  });

  it('returns loading state', () => {
    const { result } = renderHook(() => useAddCity());

    expect(result.current.loading).toBe(false);
  });

  it('adds city and triggers cache update (SUCCESS path)', async () => {
    const city: City = {
      id: '1',
      city: 'Kyiv',
    };

    mutate.mockResolvedValue({
      data: {
        addCity: city,
      },
    });

    const { result } = renderHook(() => useAddCity());

    let response: City | null = null;

    await act(async () => {
      response = await result.current.addCity(50.45, 30.52, 'Kyiv');
    });

    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          lat: 50.45,
          lon: 30.52,
          city: 'Kyiv',
        },
      },
    });

    expect(response).toEqual(city);

    updateFn(
      {
        evict: cacheEvict,
        gc: cacheGc,
      } as never,
      {
        data: {
          addCity: city,
        },
      } as never,
      {} as never,
    );

    expect(cacheEvict).toHaveBeenCalledWith({
      fieldName: 'citiesPaginated',
    });

    expect(cacheGc).toHaveBeenCalled();
  });

  it('does NOT update cache when no city returned', async () => {
    mutate.mockResolvedValue({
      data: undefined,
    });

    const { result } = renderHook(() => useAddCity());

    await act(async () => {
      await result.current.addCity(1, 2, 'Kyiv');
    });

    const cache = {
      evict: vi.fn(),
      gc: vi.fn(),
    };

    updateFn(
      cache as never,
      {
        data: undefined,
      } as never,
      {} as never,
    );

    expect(cache.evict).not.toHaveBeenCalled();
    expect(cache.gc).not.toHaveBeenCalled();
  });
});
