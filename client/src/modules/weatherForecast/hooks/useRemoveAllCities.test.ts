import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMutation } from '@apollo/client/react';

import { useRemoveAllCities } from './useRemoveAllCities';

vi.mock('@apollo/client/react');

describe('useRemoveAllCities', () => {
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

  it('returns success result', async () => {
    mutate.mockResolvedValue({
      data: {
        removeAllCities: true,
      },
    });

    const { result } = renderHook(() => useRemoveAllCities());

    let response;

    await act(async () => {
      response = await result.current.removeAllCities();
    });

    expect(response).toEqual({
      ok: true,
      code: undefined,
    });
  });

  it('returns failed result', async () => {
    mutate.mockRejectedValue(new Error());

    const { result } = renderHook(() => useRemoveAllCities());

    let response;

    await act(async () => {
      response = await result.current.removeAllCities();
    });

    expect(response).toEqual({
      ok: false,
      code: undefined,
    });
  });
});
