import { renderHook, act } from '@testing-library/react';
import { useLogout } from './useLogout';
import { useMutation } from '@apollo/client/react';
import { vi } from 'vitest';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useLogout', () => {
  it('calls logout mutation', async () => {
    const mockLogoutMutation = vi.fn().mockResolvedValue({});

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockLogoutMutation,
    ]);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(mockLogoutMutation).toHaveBeenCalledTimes(1);
  });
});
