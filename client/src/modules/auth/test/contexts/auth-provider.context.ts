import { vi } from 'vitest';

import type { IMeQuery } from '@/auth/types';

export type AuthProviderContext = {
  data: IMeQuery | undefined;
  refetch: ReturnType<typeof vi.fn>;

  setAuthenticated: () => void;
  setAnonymous: () => void;
};

export const createAuthProviderContext = (): AuthProviderContext => {
  const ctx: AuthProviderContext = {
    data: undefined,

    refetch: vi.fn(),

    setAuthenticated: () => {
      ctx.data = {
        me: {
          userId: '123',
        },
      };
    },

    setAnonymous: () => {
      ctx.data = undefined;
    },
  };

  return ctx;
};
