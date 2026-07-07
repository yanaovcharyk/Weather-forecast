import { vi } from 'vitest';

import type { AuthProviderContext } from '@/auth/testing/contexts';
import {
  useApolloClientMock,
  useMutationMock,
  useQueryMock,
} from '@/common/testing/mocks/apollo.mock';
import {
  createMutationResult,
  createQueryResult,
} from '@/common/testing/factories';

export const setupAuthProviderRuntime = (ctx: AuthProviderContext) => {
  vi.clearAllMocks();

  ctx.clearStore.mockResolvedValue(undefined);
  ctx.logoutMutation.mockResolvedValue({});

  useQueryMock.mockImplementation(() =>
    createQueryResult({
      data: ctx.data,
      refetch: ctx.refetch as never,
    }),
  );

  useMutationMock.mockReturnValue([ctx.logoutMutation, createMutationResult()]);

  useApolloClientMock.mockReturnValue({
    clearStore: ctx.clearStore,
  });
};
