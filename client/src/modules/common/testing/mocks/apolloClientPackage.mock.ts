import { vi } from 'vitest';

import type {
  ApolloClientCacheConfig,
  ApolloClientPackageMocks,
} from '@/common/testing/contexts/apolloClient.context';

export const createApolloClientPackageMock = (
  actual: typeof import('@apollo/client'),
  mocks: ApolloClientPackageMocks,
) => {
  const MockApolloLink = vi.fn(function (
    this: Record<string, unknown>,
    request?: unknown,
  ) {
    Object.assign(this, { request });
  });

  Object.assign(MockApolloLink, {
    from: mocks.mockApolloLinkFrom,
  });

  const MockHttpLink = vi.fn(function (
    this: Record<string, unknown>,
    config: unknown,
  ) {
    Object.assign(this, { config });
  });

  const MockInMemoryCache = vi.fn(function (
    this: Record<string, unknown>,
    config: ApolloClientCacheConfig,
  ) {
    mocks.capturedCacheConfig = config;

    Object.assign(this, { config });
  });

  mocks.mockHttpLink = MockHttpLink;
  mocks.mockInMemoryCache = MockInMemoryCache;

  return {
    ...actual,
    ApolloClient: mocks.mockApolloClient,
    ApolloLink: MockApolloLink,
    HttpLink: MockHttpLink,
    InMemoryCache: MockInMemoryCache,
  };
};
