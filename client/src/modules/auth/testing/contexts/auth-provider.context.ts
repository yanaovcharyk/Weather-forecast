import { vi } from 'vitest';

import type { IMeQuery } from '@/auth/types';

export type AuthProviderContext = {
  data: IMeQuery | undefined;
  clearStore: ReturnType<typeof vi.fn>;
  logoutMutation: ReturnType<typeof vi.fn>;
  refetch: ReturnType<typeof vi.fn>;

  setAuthenticated: () => void;
  setAnonymous: () => void;
};

export const createAuthProviderContext = (): AuthProviderContext => {
  const ctx: AuthProviderContext = {
    data: undefined,

    clearStore: vi.fn(),
    logoutMutation: vi.fn(),
    refetch: vi.fn(),

    setAuthenticated: () => {
      ctx.data = {
        me: {
          id: '123',
          email: 'test@example.com',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      };
    },

    setAnonymous: () => {
      ctx.data = undefined;
    },
  };

  return ctx;
};
