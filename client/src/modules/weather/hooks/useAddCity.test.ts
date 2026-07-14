import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ADDED_CITY_FIXTURE,
  ADD_CITY_INPUT_FIXTURE,
  addCity,
  setupAddCity,
  setupAddCityRuntime,
} from '@/weather/testing/setups/addCity.setup';

describe('useAddCity', () => {
  let runtime: ReturnType<typeof setupAddCityRuntime>;

  beforeEach(() => {
    runtime = setupAddCityRuntime();
  });

  it('returns loading state from Apollo mutation result', () => {
    const { result } = setupAddCity();

    expect(result.current.loading).toBe(false);
  });

  it('adds city and clears getSavedCitiesPaginated cache after successful mutation', async () => {
    runtime.mutate.mockResolvedValue({
      data: {
        addSavedCity: ADDED_CITY_FIXTURE,
      },
    });

    const { result } = setupAddCity();
    const addCityResult = await addCity(result);

    expect(runtime.mutate).toHaveBeenCalledWith({
      variables: {
        input: ADD_CITY_INPUT_FIXTURE,
      },
    });
    expect(addCityResult).toEqual(ADDED_CITY_FIXTURE);

    runtime.runApolloCacheUpdate({
      addSavedCity: ADDED_CITY_FIXTURE,
    });

    expect(runtime.cache.evict).toHaveBeenCalledWith({
      fieldName: 'getSavedCitiesPaginated',
    });
    expect(runtime.cache.gc).toHaveBeenCalled();
  });

  it('does not clear Apollo cache when mutation returns no city', async () => {
    const cache = {
      evict: vi.fn(),
      gc: vi.fn(),
    };

    runtime.mutate.mockResolvedValue({
      data: undefined,
    });

    const { result } = setupAddCity();

    await addCity(result, {
      cityName: 'Kyiv',
      lat: 1,
      lon: 2,
    });

    runtime.runApolloCacheUpdate(undefined, cache);

    expect(cache.evict).not.toHaveBeenCalled();
    expect(cache.gc).not.toHaveBeenCalled();
  });
});
