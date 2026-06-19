import { vi } from 'vitest';
import type { IMeQuery } from '@/auth/types';

export const createAuthProviderContext = () => {
  return {
    data: undefined as IMeQuery | undefined,

    refetch: vi.fn(),

    setAuthenticated() {
      this.data = {
        me: {
          userId: '123',
        },
      };
    },

    setAnonymous() {
      this.data = {
        me: null,
      };
    },
  };
};

export type AuthProviderContext = ReturnType<typeof createAuthProviderContext>;
