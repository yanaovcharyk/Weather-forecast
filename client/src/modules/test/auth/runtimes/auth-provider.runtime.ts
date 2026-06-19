import { useQuery } from '@apollo/client/react';
import type { AuthProviderContext } from '../contexts/auth-provider.context';

export const setupAuthProviderRuntime = (ctx: AuthProviderContext) => {
  vi.clearAllMocks();

  vi.mocked(useQuery).mockImplementation(
    () =>
      ({
        data: ctx.data,
        loading: false,
        refetch: ctx.refetch,
      }) as never,
  );
};
