import { renderHook, act } from '@testing-library/react';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { useMutation } from '@apollo/client/react';
import {
  useAddCity,
  type AddCityMutation,
  type AddCityVariables,
} from './useAddCity';
import { createMutationResult } from '@/common/testing/factories';
import type { City } from '@/weatherForecast/types';

vi.mock('@apollo/client/react');

type MutationOptions = Parameters<
  typeof useMutation<AddCityMutation, AddCityVariables>
>[1];

type ApolloCacheUpdateCallback = NonNullable<
  NonNullable<MutationOptions>['update']
>;

describe('useAddCity', () => {
  const executeAddCityMutationMock = vi.fn();

  let capturedApolloCacheUpdateCallback!: ApolloCacheUpdateCallback;

  const evictCitiesPaginatedCacheMock = vi.fn();
  const runApolloCacheGarbageCollectionMock = vi.fn();

  const runCapturedApolloCacheUpdate = (
    mutationData: AddCityMutation | undefined,
    cache = {
      evict: evictCitiesPaginatedCacheMock,
      gc: runApolloCacheGarbageCollectionMock,
    },
  ) => {
    capturedApolloCacheUpdateCallback(
      cache as never,
      {
        data: mutationData,
      } as never,
      {} as never,
    );

    return cache;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMutation).mockImplementation((_mutationDocument, options) => {
      if (options?.update) {
        capturedApolloCacheUpdateCallback = options.update;
      }

      return [
        executeAddCityMutationMock,
        createMutationResult<AddCityMutation>(),
      ] as unknown as ReturnType<typeof useMutation>;
    });
  });

  it('returns loading state from Apollo mutation result', () => {
    const { result } = renderHook(() => useAddCity());

    expect(result.current.loading).toBe(false);
  });

  it('adds city and clears citiesPaginated cache after successful mutation', async () => {
    const addedCity: City = {
      id: '1',
      cityName: 'Kyiv',
      lat: 50.45,
      lon: 30.52,
      isPinned: false,
      weather: null,
    };

    executeAddCityMutationMock.mockResolvedValue({
      data: {
        addCity: addedCity,
      },
    });

    const { result } = renderHook(() => useAddCity());

    let addCityResult: City | null = null;

    await act(async () => {
      addCityResult = await result.current.addCity(50.45, 30.52, 'Kyiv');
    });

    expect(executeAddCityMutationMock).toHaveBeenCalledWith({
      variables: {
        input: {
          lat: 50.45,
          lon: 30.52,
          cityName: 'Kyiv',
        },
      },
    });

    expect(addCityResult).toEqual(addedCity);

    runCapturedApolloCacheUpdate({
      addCity: addedCity,
    });

    expect(evictCitiesPaginatedCacheMock).toHaveBeenCalledWith({
      fieldName: 'citiesPaginated',
    });

    expect(runApolloCacheGarbageCollectionMock).toHaveBeenCalled();
  });

  it('does not clear Apollo cache when mutation returns no city', async () => {
    executeAddCityMutationMock.mockResolvedValue({
      data: undefined,
    });

    const { result } = renderHook(() => useAddCity());

    await act(async () => {
      await result.current.addCity(1, 2, 'Kyiv');
    });

    const apolloCacheMock = runCapturedApolloCacheUpdate(undefined, {
      evict: vi.fn(),
      gc: vi.fn(),
    });

    expect(apolloCacheMock.evict).not.toHaveBeenCalled();
    expect(apolloCacheMock.gc).not.toHaveBeenCalled();
  });
});
