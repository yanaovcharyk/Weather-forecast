import { renderHook, act } from '@testing-library/react';
import { useMutation } from '@apollo/client/react';

import { useLogout } from './useLogout';
import { createLogoutContext } from '@/auth/test/contexts';

vi.mock('@apollo/client/react');

describe('useLogout', () => {
  let ctx: ReturnType<typeof createLogoutContext>;

  beforeEach(() => {
    ctx = createLogoutContext();

    vi.mocked(useMutation).mockReturnValue([
      ctx.mutation.mutate,
      ctx.mutation.result,
    ]);
  });

  it('calls logout mutation', async () => {
    ctx.mutation.mutate.mockResolvedValue({});

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(ctx.mutation.mutate).toHaveBeenCalledTimes(1);
  });
});
