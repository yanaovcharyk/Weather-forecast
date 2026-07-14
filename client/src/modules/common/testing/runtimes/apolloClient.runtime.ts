import { vi } from 'vitest';

import type { ApolloClientPackageMocks } from '@/common/testing/contexts/apolloClient.context';

export const setupApolloClientRuntime = (mocks: ApolloClientPackageMocks) => {
  vi.clearAllMocks();
  mocks.capturedCacheConfig = undefined;

  setWindowLocation({
    href: '',
    pathname: '/',
  });
};

export const setWindowLocation = ({
  href,
  pathname,
}: {
  href: string;
  pathname: string;
}) => {
  Object.defineProperty(window, 'location', {
    value: {
      href,
      pathname,
    },
    writable: true,
  });
};
