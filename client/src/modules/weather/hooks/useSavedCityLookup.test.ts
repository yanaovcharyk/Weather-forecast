import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useLazyQuery } from '@apollo/client/react';

import { GET_SAVED_CITY } from '@/common/graphql';
import { useSavedCityLookup } from './useSavedCityLookup';

vi.mock('@apollo/client/react');

describe('useSavedCityLookup', () => {
  const fetchSavedCity = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useLazyQuery).mockReturnValue([fetchSavedCity] as never);
  });

  it('returns city', async () => {
    const city = {
      id: '1',
      cityName: 'Kyiv',
    };

    fetchSavedCity.mockResolvedValue({
      data: {
        getSavedCity: city,
      },
    });

    const { result } = renderHook(() => useSavedCityLookup());

    let response;

    await act(async () => {
      response = await result.current.getSavedCity({
        cityName: 'Kyiv',
        includeWeather: true,
      });
    });

    expect(useLazyQuery).toHaveBeenCalledWith(GET_SAVED_CITY, {
      fetchPolicy: 'network-only',
    });
    expect(fetchSavedCity).toHaveBeenCalledWith({
      variables: {
        cityName: 'Kyiv',
        includeWeather: true,
      },
    });
    expect(response).toEqual(city);
  });

  it('returns null', async () => {
    fetchSavedCity.mockResolvedValue({
      data: {
        getSavedCity: null,
      },
    });

    const { result } = renderHook(() => useSavedCityLookup());

    let response;

    await act(async () => {
      response = await result.current.getSavedCity({ cityName: 'Kyiv' });
    });

    expect(response).toBeNull();
  });
});
