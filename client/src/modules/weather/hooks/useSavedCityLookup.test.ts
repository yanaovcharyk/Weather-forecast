import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useApolloClient } from '@apollo/client/react';

import { GET_SAVED_CITY } from '@/common/graphql';
import { useSavedCityLookup } from './useSavedCityLookup';

vi.mock('@apollo/client/react');

describe('useSavedCityLookup', () => {
  const query = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useApolloClient).mockReturnValue({
      query,
    } as never);
  });

  it('returns city', async () => {
    const city = {
      id: '1',
      cityName: 'Kyiv',
    };

    query.mockResolvedValue({
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

    expect(query).toHaveBeenCalledWith({
      query: GET_SAVED_CITY,
      variables: {
        cityName: 'Kyiv',
        includeWeather: true,
      },
      fetchPolicy: 'network-only',
    });
    expect(response).toEqual(city);
  });

  it('returns null', async () => {
    query.mockResolvedValue({
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
