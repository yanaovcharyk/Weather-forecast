import { vi } from 'vitest';

import type { AuthProviderContext } from '@/auth/test/contexts';
import { useQueryMock } from '@/common/test/mocks/apollo.mock';
import { createQueryResult } from '@/common/test/factories';

export const setupAuthProviderRuntime = (ctx: AuthProviderContext) => {
  vi.clearAllMocks();

  useQueryMock.mockImplementation(() =>
    createQueryResult({
      data: ctx.data,
      refetch: ctx.refetch as never,
    }),
  );
};
