import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMutation } from '@apollo/client/react';

import { useTogglePinned } from './useTogglePinned';

vi.mock('@apollo/client/react');

describe('useTogglePinned', () => {
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

  it('toggles city pin', async () => {
    const { result } = renderHook(() => useTogglePinned());

    await act(async () => {
      await result.current.togglePinned('1', false);
    });

    expect(mutate).toHaveBeenCalled();
  });

  it('returns loading state', () => {
    vi.mocked(useMutation).mockReturnValue([
      mutate,
      {
        loading: true,
      },
    ] as never);

    const { result } = renderHook(() => useTogglePinned());

    expect(result.current.loading).toBe(true);
  });
});
