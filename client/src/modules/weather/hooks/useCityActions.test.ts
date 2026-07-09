import { act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createControlledPromise } from '@/common/testing/factories';
import {
  createCityActionsContext,
  type CityActionsContext,
} from '@/weather/testing/contexts/cityActions.context';
import { setupCityActionsRuntime } from '@/weather/testing/setups/cityActions.runtime';
import { setupCityActions } from '@/weather/testing/setups/cityActions.setup';
import type { City } from '@/weather/types';

const mockHandleResult = vi.fn();

vi.mock('@/common/utils', () => ({
  handleResult: (...args: unknown[]) => mockHandleResult(...args),
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock('./useAddCity');
vi.mock('./useRemoveCity');
vi.mock('./useRemoveAllCities');
vi.mock('./useTogglePinned');
vi.mock('./useSavedCityLookup');
vi.mock('@/common/hooks/useToast');

describe('useCityActions', () => {
  let ctx: CityActionsContext;
  const selectedCity = {
    cityName: 'Kyiv',
    lat: 10,
    lon: 20,
  };

  beforeEach(() => {
    ctx = createCityActionsContext();
    setupCityActionsRuntime(ctx);
  });

  it('should add city successfully', async () => {
    ctx.getSavedCity.mockResolvedValue(null);

    const { handleAddCity } = setupCityActions();

    await act(async () => {
      await handleAddCity(selectedCity);
    });

    expect(ctx.addCity).toHaveBeenCalledWith(selectedCity);
    expect(ctx.toast.success).toHaveBeenCalledWith(
      'City Kyiv added successfully',
    );
  });

  it('should handle existing city', async () => {
    ctx.getSavedCity.mockResolvedValue({
      id: '123',
      cityName: 'Kyiv',
    } as City);

    const { handleAddCity } = setupCityActions();

    await act(async () => {
      await handleAddCity(selectedCity);
    });

    expect(ctx.setSearchParams).toHaveBeenCalled();
    expect(ctx.toast.info).toHaveBeenCalledWith('City Kyiv already exists');
    expect(ctx.addCity).not.toHaveBeenCalled();
  });

  it('should handle add city error', async () => {
    ctx.getSavedCity.mockRejectedValue(new Error());

    const { handleAddCity } = setupCityActions();

    await act(async () => {
      await handleAddCity(selectedCity);
    });

    expect(ctx.toast.error).toHaveBeenCalledWith('Failed to add city');
  });

  it('should remove city', async () => {
    const { handleRemoveCity } = setupCityActions();

    await act(async () => {
      await handleRemoveCity('123', 'Kyiv');
    });

    expect(ctx.removeCity).toHaveBeenCalledWith('123');
    expect(mockHandleResult).toHaveBeenCalled();
  });

  it('should remove selected city', async () => {
    setupCityActionsRuntime(ctx, {
      existingId: '123',
    });

    const { handleRemoveCity } = setupCityActions();

    await act(async () => {
      await handleRemoveCity('123', 'Kyiv');
    });

    expect(ctx.setSearchParams).toHaveBeenCalled();
  });

  it('should toggle pinned', async () => {
    const { handleTogglePinned } = setupCityActions();

    await act(async () => {
      await handleTogglePinned('123', false);
    });

    expect(ctx.togglePinned).toHaveBeenCalledWith('123', false);
  });

  it('should remove all cities success', async () => {
    ctx.removeAllCities.mockResolvedValue({
      ok: true,
      code: undefined,
    });

    const { handleDeleteAllCities } = setupCityActions();

    await act(async () => {
      await handleDeleteAllCities();
    });

    expect(mockHandleResult).toHaveBeenCalledWith(
      {
        ok: true,
        code: undefined,
      },
      expect.any(Object),
    );
  });

  it('should remove all cities failed', async () => {
    ctx.removeAllCities.mockResolvedValue({
      ok: false,
      code: undefined,
    });

    const { handleDeleteAllCities } = setupCityActions();

    await act(async () => {
      await handleDeleteAllCities();
    });

    expect(mockHandleResult).toHaveBeenCalledWith(
      {
        ok: false,
        code: undefined,
      },
      expect.any(Object),
    );
  });

  it('should return initial state', () => {
    const { result } = setupCityActions();

    expect(result.current.isAddingCity).toBe(false);
    expect(result.current.currentlyRemovingCityId).toBe(null);
    expect(result.current.currentlySelectedCity).toBe(null);
  });

  it('should return early when city is already being added', async () => {
    const deferred = createControlledPromise<City | null>();
    ctx.getSavedCity.mockReturnValue(deferred.promise);

    const { result } = setupCityActions();

    let firstRequest!: Promise<void>;

    act(() => {
      firstRequest = result.current.handleAddCity(selectedCity);
    });

    await act(async () => {
      await result.current.handleAddCity(selectedCity);
    });

    expect(ctx.getSavedCity).toHaveBeenCalledTimes(1);

    await act(async () => {
      deferred.resolve(null);
      await firstRequest;
    });
  });

  it('should update selected city pinned state', async () => {
    ctx.getSavedCity.mockResolvedValue({
      id: '123',
      cityName: 'Kyiv',
      isPinned: false,
    } as City);

    setupCityActionsRuntime(ctx, {
      existingId: '123',
    });

    const { result } = setupCityActions();

    await waitFor(() => {
      expect(result.current.currentlySelectedCity?.id).toBe('123');
    });

    await act(async () => {
      await result.current.handleTogglePinned('123', false);
    });

    expect(result.current.currentlySelectedCity).toEqual({
      id: '123',
      cityName: 'Kyiv',
      isPinned: true,
    });
  });

  it('should ignore existing city lookup result after unmount', async () => {
    const deferred = createControlledPromise<City | null>();
    ctx.getSavedCity.mockReturnValue(deferred.promise);

    setupCityActionsRuntime(ctx, {
      existingId: '123',
    });

    const { unmount } = setupCityActions();

    unmount();

    await act(async () => {
      deferred.resolve({
        id: '123',
        cityName: 'Kyiv',
      } as City);
      await deferred.promise;
    });

    expect(ctx.setSearchParams).not.toHaveBeenCalled();
  });

  it('should ignore existing city lookup error after unmount', async () => {
    const deferred = createControlledPromise<City | null>();
    ctx.getSavedCity.mockReturnValue(deferred.promise);

    setupCityActionsRuntime(ctx, {
      existingId: '123',
    });

    const { unmount } = setupCityActions();

    unmount();

    await act(async () => {
      deferred.reject(new Error('lookup failed'));

      try {
        await deferred.promise;
      } catch {
        // Expected rejection is handled by the hook after unmount.
      }
    });

    expect(ctx.setSearchParams).not.toHaveBeenCalled();
  });

  it('should clear existing city selection when existing city lookup fails', async () => {
    ctx.getSavedCity.mockRejectedValue(new Error());

    setupCityActionsRuntime(ctx, {
      existingId: '123',
    });

    setupCityActions();

    await waitFor(() => {
      expect(ctx.setSearchParams).toHaveBeenCalled();
    });
  });
});
