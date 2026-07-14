import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { GET_SAVED_CITY } from '@/common/graphql';
import {
  mockApolloLazyQuery,
  useLazyQueryMock,
} from '@/common/testing/mocks/apollo.mock';
import { useSavedCityLookup } from './useSavedCityLookup';

describe('useSavedCityLookup', () => {
  const fetchSavedCity = vi.fn();

  const setup = () => {
    const { result } = renderHook(() => useSavedCityLookup());

    const getSavedCity = async (
      params: Parameters<typeof result.current.getSavedCity>[0],
    ) => {
      let response;

      await act(async () => {
        response = await result.current.getSavedCity(params);
      });

      return response;
    };

    return {
      getSavedCity,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockApolloLazyQuery({
      execute: fetchSavedCity,
    });
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

    const { getSavedCity } = setup();

    const response = await getSavedCity({
      cityName: 'Kyiv',
      includeWeather: true,
    });

    expect(useLazyQueryMock).toHaveBeenCalledWith(GET_SAVED_CITY, {
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

    const { getSavedCity } = setup();

    const response = await getSavedCity({
      cityName: 'Kyiv',
    });

    expect(response).toBeNull();
  });
});
