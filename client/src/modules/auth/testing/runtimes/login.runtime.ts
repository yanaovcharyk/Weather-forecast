import { useMutation } from '@apollo/client/react';
import { useAuthContext } from '@/auth/contexts/AuthContext';
import { useToast } from '@/common/hooks/useToast';
import { useNavigate } from 'react-router-dom';
import type { LoginContext } from '@/auth/testing/contexts/login.context';
import { createMutationState } from '@/auth/testing/mocks/mutationState.mock';
import { createAuthMock } from '@/common/testing/mocks/auth.mock';

export const setupLoginRuntime = (
  ctx: LoginContext,
  options?: {
    loading?: boolean;
  },
) => {
  vi.mocked(useMutation).mockReturnValue([
    ctx.mutate,
    createMutationState({
      loading: options?.loading ?? false,
    }),
  ]);

  vi.mocked(useAuthContext).mockReturnValue(
    createAuthMock({
      refreshSession: ctx.refreshSession,
    }),
  );

  vi.mocked(useToast).mockReturnValue(ctx.toast as never);

  vi.mocked(useNavigate).mockReturnValue(ctx.navigate);
};
