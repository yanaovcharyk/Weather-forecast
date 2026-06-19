import type { IMeQuery } from '@/auth/types';

export const AUTHENTICATED_ME_FIXTURE: IMeQuery = {
  me: {
    userId: '123',
  },
};

export const ANONYMOUS_ME_FIXTURE = {
  me: undefined,
};
