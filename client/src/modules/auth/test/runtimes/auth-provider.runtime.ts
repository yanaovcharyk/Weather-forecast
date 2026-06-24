import { vi } from 'vitest';

import type { AuthProviderContext } from '../contexts';
import { useQueryMock } from '../../../test/mocks/apollo.mock';

export const setupAuthProviderRuntime = (ctx: AuthProviderContext) => {
  vi.clearAllMocks();

  useQueryMock.mockImplementation(() => ({
    data: ctx.data,
    loading: false,
    refetch: ctx.refetch,
  }));
};
