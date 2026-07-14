import { act, renderHook, waitFor } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';

import { useAddCityHandler } from './useAddCityHandler';
import { useAddCity } from './useAddCity';
import { useSavedCityLookup } from './useSavedCityLookup';
import { useToast } from '@/common/hooks/useToast';
import { CITY_FIXTURE } from '@/weather/testing/fixtures';
import { createControlledPromise } from '@/common/testing/factories';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock('@/common/hooks/useToast');
vi.mock('./useAddCity');
vi.mock('./useSavedCityLookup');

describe('useAddCityHandler', () => {
  const addCity = vi.fn();
  const getSavedCity = vi.fn();
  const setSearchParams = vi.fn();
  const toast = {
    toast: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  };

  const selectedCity = {
    cityName: 'Kyiv',
    lat: 50.45,
    lon: 30.52,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAddCity).mockReturnValue({
      addCity,
      loading: false,
    });
    vi.mocked(useSavedCityLookup).mockReturnValue({
      getSavedCity,
    });
    vi.mocked(useToast).mockReturnValue(toast);
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('sortBy=cityName'),
      setSearchParams,
    ]);

    getSavedCity.mockResolvedValue(null);
    addCity.mockResolvedValue(undefined);
  });

  it('adds city and shows success toast', async () => {
    const { result } = renderHook(() => useAddCityHandler());

    await act(async () => {
      await result.current.handleAddCity(selectedCity);
    });

    expect(addCity).toHaveBeenCalledWith(selectedCity);
    expect(toast.success).toHaveBeenCalledWith('City Kyiv added successfully');
  });

  it('clears existing city selection after adding a new city', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('existingId=1&sortBy=cityName'),
      setSearchParams,
    ]);

    const { result } = renderHook(() => useAddCityHandler());

    await act(async () => {
      await result.current.handleAddCity(selectedCity);
    });

    const updatedParams = setSearchParams.mock.calls[0][0];

    expect(updatedParams.get('existingId')).toBeNull();
    expect(updatedParams.get('sortBy')).toBe('cityName');
    expect(addCity).toHaveBeenCalledWith(selectedCity);
  });

  it('selects existing city and shows info toast', async () => {
    getSavedCity.mockResolvedValue(CITY_FIXTURE);

    const { result } = renderHook(() => useAddCityHandler());

    await act(async () => {
      await result.current.handleAddCity(selectedCity);
    });

    const updatedParams = setSearchParams.mock.calls[0][0];

    expect(updatedParams.get('existingId')).toBe(CITY_FIXTURE.id);
    expect(updatedParams.get('sortBy')).toBe('cityName');
    expect(addCity).not.toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith('City Kyiv already exists');
  });

  it('shows error toast when adding fails', async () => {
    addCity.mockRejectedValue(new Error('Nope'));

    const { result } = renderHook(() => useAddCityHandler());

    await act(async () => {
      await result.current.handleAddCity(selectedCity);
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to add city');
  });

  it('ignores duplicate submit while add flow is in progress', async () => {
    const lookup = createControlledPromise<null>();
    getSavedCity.mockReturnValue(lookup.promise);

    const { result } = renderHook(() => useAddCityHandler());

    act(() => {
      void result.current.handleAddCity(selectedCity);
    });

    await waitFor(() => {
      expect(result.current.isAddingCity).toBe(true);
    });

    await act(async () => {
      await result.current.handleAddCity(selectedCity);
    });

    expect(getSavedCity).toHaveBeenCalledTimes(1);

    await act(async () => {
      lookup.resolve(null);
      await lookup.promise;
    });
  });
});
