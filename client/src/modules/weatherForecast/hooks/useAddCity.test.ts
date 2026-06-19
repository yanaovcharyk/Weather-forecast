import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMutation } from '@apollo/client/react';

import { useAddCity } from './useAddCity';

vi.mock('@apollo/client/react');

describe('useAddCity', () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMutation).mockReturnValue([
      mutate,
      {
        loading: false,
      },
    ] as never);
  });

  it('returns loading state', () => {
    const { result } = renderHook(() => useAddCity());

    expect(result.current.loading).toBe(false);
  });

  it('adds city', async () => {
    const city = {
      id: '1',
      city: 'Kyiv',
    };

    mutate.mockResolvedValue({
      data: {
        addCity: city,
      },
    });

    const { result } = renderHook(() => useAddCity());

    let response;

    await act(async () => {
      response = await result.current.addCity(50.45, 30.52, 'Kyiv');
    });

    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          lat: 50.45,
          lon: 30.52,
          city: 'Kyiv',
        },
      },
    });

    expect(response).toEqual(city);
  });

  it('returns null when no city returned', async () => {
    mutate.mockResolvedValue({
      data: undefined,
    });

    const { result } = renderHook(() => useAddCity());

    let response;

    await act(async () => {
      response = await result.current.addCity(1, 2, 'Kyiv');
    });

    expect(response).toBeNull();
  });
});
