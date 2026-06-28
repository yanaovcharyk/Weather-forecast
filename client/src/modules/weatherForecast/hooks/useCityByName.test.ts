import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useApolloClient } from '@apollo/client/react';

import { useCityByName } from './useCityByName';

vi.mock('@apollo/client/react');

describe('useCityByName', () => {
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
        cityByName: city,
      },
    });

    const { result } = renderHook(() => useCityByName());

    let response;

    await act(async () => {
      response = await result.current.getCityByName('Kyiv');
    });

    expect(response).toEqual(city);
  });

  it('returns null', async () => {
    query.mockResolvedValue({
      data: {
        cityByName: null,
      },
    });

    const { result } = renderHook(() => useCityByName());

    let response;

    await act(async () => {
      response = await result.current.getCityByName('Kyiv');
    });

    expect(response).toBeNull();
  });
});
