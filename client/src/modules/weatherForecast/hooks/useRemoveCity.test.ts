import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMutation } from '@apollo/client/react';

import { useRemoveCity } from './useRemoveCity';

vi.mock('@apollo/client/react');

describe('useRemoveCity', () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMutation).mockReturnValue([
      mutate,
      {
        loading: false,
        error: undefined,
      },
    ] as never);
  });

  it('removes city', async () => {
    const { result } = renderHook(() => useRemoveCity());

    await act(async () => {
      await result.current.removeCity('123');
    });

    expect(mutate).toHaveBeenCalledWith({
      variables: {
        id: '123',
      },
    });
  });

  it('returns loading and error state', () => {
    const error = new Error('test');

    vi.mocked(useMutation).mockReturnValue([
      mutate,
      {
        loading: true,
        error,
      },
    ] as never);

    const { result } = renderHook(() => useRemoveCity());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(error);
  });
});
