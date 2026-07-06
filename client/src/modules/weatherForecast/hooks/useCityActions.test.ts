import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createControlledPromise } from '@/common/testing/factories';
import {
  createCityActionsContext,
  type CityActionsContext,
} from '@/weatherForecast/testing/contexts/cityActions.context';
import { setupCityActionsRuntime } from '@/weatherForecast/testing/setups/cityActions.runtime';
import { setupCityActions } from '@/weatherForecast/testing/setups/cityActions.setup';
import type { City } from '@/weatherForecast/types';

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

describe('useCityActions', () => {
  let ctx: CityActionsContext;

  beforeEach(() => {
    ctx = createCityActionsContext();
    setupCityActionsRuntime(ctx);
  });

  it('should add city successfully', async () => {
    ctx.getSavedCity.mockResolvedValue(null);

    const { handleAddCity } = setupCityActions(ctx);

    await act(async () => {
      await handleAddCity(10, 20, 'Kyiv');
    });

    expect(ctx.addCity).toHaveBeenCalledWith(10, 20, 'Kyiv');
    expect(ctx.showSuccessNotification).toHaveBeenCalledWith(
      'City Kyiv added successfully',
    );
  });

  it('should handle existing city', async () => {
    ctx.getSavedCity.mockResolvedValue({
      id: '123',
      cityName: 'Kyiv',
    } as City);

    const { handleAddCity } = setupCityActions(ctx);

    await act(async () => {
      await handleAddCity(10, 20, 'Kyiv');
    });

    expect(ctx.setSearchParams).toHaveBeenCalled();
    expect(ctx.showInfoNotification).toHaveBeenCalledWith(
      'City Kyiv already exists',
    );
    expect(ctx.addCity).not.toHaveBeenCalled();
  });

  it('should handle add city error', async () => {
    ctx.getSavedCity.mockRejectedValue(new Error());

    const { handleAddCity } = setupCityActions(ctx);

    await act(async () => {
      await handleAddCity(10, 20, 'Kyiv');
    });

    expect(ctx.showErrorNotification).toHaveBeenCalledWith(
      'Failed to add city',
    );
  });

  it('should remove city', async () => {
    const { handleRemoveCity } = setupCityActions(ctx);

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

    const { handleRemoveCity } = setupCityActions(ctx);

    await act(async () => {
      await handleRemoveCity('123', 'Kyiv');
    });

    expect(ctx.setSearchParams).toHaveBeenCalled();
  });

  it('should toggle pinned', async () => {
    const { handleTogglePinned } = setupCityActions(ctx);

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

    const { handleDeleteAllCities } = setupCityActions(ctx);

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

    const { handleDeleteAllCities } = setupCityActions(ctx);

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
    const { result } = setupCityActions(ctx);

    expect(result.current.isAddingCity).toBe(false);
    expect(result.current.currentlyRemovingCityId).toBe(null);
    expect(result.current.currentlySelectedCity).toBe(null);
  });

  it('should return early when city is already being added', async () => {
    const deferred = createControlledPromise<City | null>();
    ctx.getSavedCity.mockReturnValue(deferred.promise);

    const { result } = setupCityActions(ctx);

    let firstRequest!: Promise<void>;

    act(() => {
      firstRequest = result.current.handleAddCity(10, 20, 'Kyiv');
    });

    await act(async () => {
      await result.current.handleAddCity(10, 20, 'Kyiv');
    });

    expect(ctx.getSavedCity).toHaveBeenCalledTimes(1);

    await act(async () => {
      deferred.resolve(null);
      await firstRequest;
    });
  });

  it('should update selected city pinned state', async () => {
    const { result } = setupCityActions(ctx);

    act(() => {
      result.current.setCurrentlySelectedCity({
        id: '123',
        cityName: 'Kyiv',
        isPinned: false,
      } as React.SetStateAction<City | null>);
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
});
