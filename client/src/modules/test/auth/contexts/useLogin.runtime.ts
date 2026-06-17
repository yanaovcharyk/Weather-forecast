import { useAuth } from '@/auth/hooks/useAuth';
import { useToast } from '@/common/hooks/useToast';
import { useMutation } from '@apollo/client/react';
import type { createUseLoginTestContext } from '../setup/useLogin.setup';

export const setupUseLoginRuntime = (
  ctx: ReturnType<typeof createUseLoginTestContext>,
) => {
  return () => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      login: ctx.login,
      logout: vi.fn(),
      isAuthenticated: false,
      loading: false,
    });

    vi.mocked(useToast).mockReturnValue({
      toast: ctx.toast,
    });

    vi.mocked(useMutation).mockReturnValue([
      ctx.mutate,
      {
        loading: false,
        data: undefined,
        error: undefined,
        called: false,
        client: {} as never,
        reset: vi.fn(),
      },
    ]);
  };
};
