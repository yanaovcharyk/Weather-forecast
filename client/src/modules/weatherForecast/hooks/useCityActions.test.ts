import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useCityActions } from './useCityActions';
import type { City } from '@/weatherForecast/types';
import {
  createControlledPromise,
  createNotificationMocks,
} from '@/test/factories';

const mockAddCity = vi.fn();
const mockRemoveCity = vi.fn();
const mockRemoveAllCities = vi.fn();
const mockTogglePinned = vi.fn();
const mockGetCityByName = vi.fn();

const mockHandleResult = vi.fn();

const mockSetSearchParams = vi.fn();

let searchParams = new URLSearchParams();

vi.mock('@/common/utils', () => ({
  handleResult: (...args: unknown[]) => mockHandleResult(...args),
}));

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [searchParams, mockSetSearchParams],
}));

vi.mock('./useAddCity', () => ({
  useAddCity: () => ({
    addCity: mockAddCity,
  }),
}));

vi.mock('./useRemoveCity', () => ({
  useRemoveCity: () => ({
    removeCity: mockRemoveCity,
  }),
}));

vi.mock('./useRemoveAllCities', () => ({
  useRemoveAllCities: () => ({
    removeAllCities: mockRemoveAllCities,
  }),
}));

vi.mock('./useTogglePinned', () => ({
  useTogglePinned: () => ({
    togglePinned: mockTogglePinned,
  }),
}));

vi.mock('./useCityByName', () => ({
  useCityByName: () => ({
    getCityByName: mockGetCityByName,
  }),
}));

describe('useCityActions', () => {
  const notifications = createNotificationMocks();

  beforeEach(() => {
    vi.clearAllMocks();

    searchParams = new URLSearchParams();
  });

  const renderUseCityActions = () =>
    renderHook(() =>
      useCityActions({
        showSuccessNotification: notifications.showSuccessNotification,
        showErrorNotification: notifications.showErrorNotification,
        showInfoNotification: notifications.showInfoNotification,
      }),
    );

  it('should add city successfully', async () => {
    mockGetCityByName.mockResolvedValue(null);

    const { result } = renderUseCityActions();

    await act(async () => {
      await result.current.handleAddCity(10, 20, 'Kyiv');
    });

    expect(mockAddCity).toHaveBeenCalledWith(10, 20, 'Kyiv');

    expect(notifications.showSuccessNotification).toHaveBeenCalledWith(
      'City Kyiv added successfully',
    );
  });

  it('should handle existing city', async () => {
    mockGetCityByName.mockResolvedValue({
      id: '123',
      city: 'Kyiv',
    });

    const { result } = renderUseCityActions();

    await act(async () => {
      await result.current.handleAddCity(10, 20, 'Kyiv');
    });

    expect(mockSetSearchParams).toHaveBeenCalled();

    expect(notifications.showInfoNotification).toHaveBeenCalledWith(
      'City Kyiv already exists',
    );

    expect(mockAddCity).not.toHaveBeenCalled();
  });

  it('should handle add city error', async () => {
    mockGetCityByName.mockRejectedValue(new Error());

    const { result } = renderUseCityActions();

    await act(async () => {
      await result.current.handleAddCity(10, 20, 'Kyiv');
    });

    expect(notifications.showErrorNotification).toHaveBeenCalledWith(
      'Failed to add city',
    );
  });

  it('should remove city', async () => {
    const { result } = renderUseCityActions();

    await act(async () => {
      await result.current.handleRemoveCity('123', 'Kyiv');
    });

    expect(mockRemoveCity).toHaveBeenCalledWith('123');

    expect(mockHandleResult).toHaveBeenCalled();
  });

  it('should remove selected city', async () => {
    searchParams = new URLSearchParams('existingId=123');

    const { result } = renderUseCityActions();

    await act(async () => {
      await result.current.handleRemoveCity('123', 'Kyiv');
    });

    expect(mockSetSearchParams).toHaveBeenCalled();
  });

  it('should toggle pinned', async () => {
    const { result } = renderUseCityActions();

    await act(async () => {
      await result.current.handleTogglePinned('123', false);
    });

    expect(mockTogglePinned).toHaveBeenCalledWith('123', false);
  });

  it('should remove all cities success', async () => {
    mockRemoveAllCities.mockResolvedValue({
      ok: true,
      code: undefined,
    });

    const { result } = renderUseCityActions();

    await act(async () => {
      await result.current.handleDeleteAllCities();
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
    mockRemoveAllCities.mockResolvedValue({
      ok: false,
      code: undefined,
    });

    const { result } = renderUseCityActions();

    await act(async () => {
      await result.current.handleDeleteAllCities();
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
    const { result } = renderUseCityActions();

    expect(result.current.isAddingCity).toBe(false);

    expect(result.current.currentlyRemovingCityId).toBe(null);

    expect(result.current.currentlySelectedCity).toBe(null);
  });

  it('should return early when city is already being added', async () => {
    const deferred = createControlledPromise<void>();

    mockGetCityByName.mockReturnValue(deferred.promise);

    const { result, rerender } = renderUseCityActions();

    act(() => {
      result.current.handleAddCity(10, 20, 'Kyiv');
    });

    rerender();

    await act(async () => {
      await result.current.handleAddCity(10, 20, 'Kyiv');

      deferred.resolve();
    });

    expect(mockGetCityByName).toHaveBeenCalledTimes(1);
  });

  it('should update selected city pinned state', async () => {
    const { result } = renderUseCityActions();

    act(() => {
      result.current.setCurrentlySelectedCity({
        id: '123',
        city: 'Kyiv',
        isPinned: false,
      } as React.SetStateAction<City | null>);
    });

    await act(async () => {
      await result.current.handleTogglePinned('123', false);
    });

    expect(result.current.currentlySelectedCity).toEqual({
      id: '123',
      city: 'Kyiv',
      isPinned: true,
    });
  });
});
