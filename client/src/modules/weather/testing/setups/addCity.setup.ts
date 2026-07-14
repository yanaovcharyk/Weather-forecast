import { act, renderHook } from '@testing-library/react';
import type { useMutation } from '@apollo/client/react';
import { vi } from 'vitest';

import { createMutationResult } from '@/common/testing/factories';
import { useMutationMock } from '@/common/testing/mocks/apollo.mock';
import {
  useAddCity,
  type AddCityMutation,
  type AddCityVariables,
} from '@/weather/hooks/useAddCity';
import type { City } from '@/weather/types';

type MutationOptions = Parameters<
  typeof useMutation<AddCityMutation, AddCityVariables>
>[1];

type ApolloCacheUpdateCallback = NonNullable<
  NonNullable<MutationOptions>['update']
>;

export const ADDED_CITY_FIXTURE: City = {
  id: '1',
  cityName: 'Kyiv',
  lat: 50.45,
  lon: 30.52,
  isPinned: false,
  weather: null,
};

export const ADD_CITY_INPUT_FIXTURE = {
  cityName: 'Kyiv',
  lat: 50.45,
  lon: 30.52,
};

export const setupAddCityRuntime = () => {
  const mutate = vi.fn();
  const cache = {
    evict: vi.fn(),
    gc: vi.fn(),
  };
  let capturedApolloCacheUpdateCallback!: ApolloCacheUpdateCallback;

  vi.clearAllMocks();

  useMutationMock.mockImplementation((_mutationDocument, options) => {
    if (options?.update) {
      capturedApolloCacheUpdateCallback = options.update;
    }

    return [
      mutate,
      createMutationResult<AddCityMutation>(),
    ] as unknown as ReturnType<typeof useMutation>;
  });

  return {
    mutate,
    cache,
    runApolloCacheUpdate: (
      mutationData: AddCityMutation | undefined,
      cacheOverride = cache,
    ) => {
      capturedApolloCacheUpdateCallback(
        cacheOverride as never,
        {
          data: mutationData,
        } as never,
        {} as never,
      );

      return cacheOverride;
    },
  };
};

export const setupAddCity = () => renderHook(() => useAddCity());

export const addCity = async (
  result: ReturnType<typeof setupAddCity>['result'],
  input = ADD_CITY_INPUT_FIXTURE,
) => {
  let response: City | null = null;

  await act(async () => {
    response = await result.current.addCity(input);
  });

  return response;
};
