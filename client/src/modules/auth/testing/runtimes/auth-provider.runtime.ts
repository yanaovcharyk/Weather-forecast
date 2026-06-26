import { vi } from 'vitest';

import type { AuthProviderContext } from '@/auth/testing/contexts';
import { useQueryMock } from '@/common/testing/mocks/apollo.mock';
import { createQueryResult } from '@/common/testing/factories';

export const setupAuthProviderRuntime = (ctx: AuthProviderContext) => {
  vi.clearAllMocks();

  useQueryMock.mockImplementation(() =>
    createQueryResult({
      data: ctx.data,
      refetch: ctx.refetch as never,
    }),
  );
};
