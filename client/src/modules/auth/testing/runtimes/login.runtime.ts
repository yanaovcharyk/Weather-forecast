import { useAuthContext } from '@/auth/contexts/AuthContext';
import { useToast } from '@/common/hooks/useToast';
import { useNavigate } from 'react-router-dom';
import type { LoginContext } from '@/auth/testing/contexts/login.context';
import { createAuthMock } from '@/common/testing/mocks/auth.mock';
import { mockApolloMutation } from '@/common/testing/mocks/apollo.mock';

export const setupLoginRuntime = (
  ctx: LoginContext,
  options?: {
    loading?: boolean;
  },
) => {
  mockApolloMutation({
    mutate: ctx.mutate,
    result: {
      loading: options?.loading ?? false,
    },
  });

  vi.mocked(useAuthContext).mockReturnValue(
    createAuthMock({
      refreshSession: ctx.refreshSession,
    }),
  );

  vi.mocked(useToast).mockReturnValue(ctx.toast as never);

  vi.mocked(useNavigate).mockReturnValue(ctx.navigate);
};
