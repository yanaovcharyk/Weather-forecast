import { expect, vi } from 'vitest';

import { createApolloClient } from '@/common/api/apollo/createApolloClient';
import { createTokenRefreshErrorLink } from '@/common/api/apollo/links/tokenRefreshErrorLink';
import type {
  ApolloClientPackageMocks,
  CityEdge,
  CityNode,
} from '@/common/testing/contexts/apolloClient.context';

export const setupApolloClientRuntime = (mocks: ApolloClientPackageMocks) => {
  vi.clearAllMocks();
  mocks.capturedCacheConfig = undefined;

  Object.defineProperty(window, 'location', {
    value: {
      href: '',
      pathname: '/',
    },
    writable: true,
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

export const createTestApolloClient = () =>
  createApolloClient({
    displayErrorMessage: vi.fn(),
  });

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

export const createCitiesConnection = ({
  edges = [],
  pageInfo = {},
}: {
  edges?: CityEdge[];
  pageInfo?: Record<string, unknown>;
} = {}) => ({
  __typename: 'CitiesConnection',
  edges,
  pageInfo,
});

export const createCityEdge = (id: string): CityEdge => ({
  node: {
    id,
  },
});

export const createMergeOptions = (cursor?: string) => ({
  args: {
    query: {
      pagination: cursor ? { cursor } : {},
    },
  },
  readField: vi.fn((_field: string, node: CityNode): string => node.id),
});
