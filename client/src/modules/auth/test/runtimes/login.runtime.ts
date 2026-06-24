import { useMutation } from '@apollo/client/react';
import { useAuth } from '@/auth/hooks/useAuth';
import { useToast } from '@/common/hooks/useToast';
import { useNavigate } from 'react-router-dom';
import type { LoginContext } from '../contexts/login.context';
import { createMutationState } from '../mocks/mutationState.mock';

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

  vi.mocked(useAuth).mockReturnValue({
    login: ctx.login,
  } as never);

  vi.mocked(useToast).mockReturnValue({
    toast: ctx.toast,
  } as never);

  vi.mocked(useNavigate).mockReturnValue(ctx.navigate);
};
