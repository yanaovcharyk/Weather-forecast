import { expect, vi } from 'vitest';

import { createTokenRefreshErrorLink } from '@/common/api/apollo/links/tokenRefreshErrorLink';
import type { ApolloClientPackageMocks } from '@/common/testing/contexts/apolloClient.context';

export const getTokenRefreshFailureHandler = () => {
  const [{ handleRefreshFailure }] = vi.mocked(createTokenRefreshErrorLink).mock
    .calls[0];

  return handleRefreshFailure;
};

export const getSavedCitiesPaginationMerge = (
  mocks: ApolloClientPackageMocks,
) => {
  const merge =
    mocks.capturedCacheConfig?.typePolicies.Query.fields.getSavedCitiesPaginated
      .merge;

  expect(merge).toBeDefined();

  return merge!;
};
