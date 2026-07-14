import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApolloClientPackageMocks } from '@/common/testing/contexts/apolloClient.context';

const mocks = vi.hoisted(
  (): ApolloClientPackageMocks => ({
    mockApolloClient: vi.fn(),
    mockApolloLinkFrom: vi.fn(() => ({})),
    mockTokenRefreshErrorLink: {},
    capturedCacheConfig: undefined,
    mockHttpLink: vi.fn(),
    mockInMemoryCache: vi.fn(),
  }),
);

vi.mock('@apollo/client', async () => {
  const actual =
    await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  const { createApolloClientPackageMock } =
    await import('@/common/testing/mocks/apolloClientPackage.mock');

  return createApolloClientPackageMock(actual, mocks);
});

vi.mock('@/common/config', () => ({
  config: {
    apiBaseUrl: 'http://localhost',
    graphqlPath: '/graphql',
    isApolloDevtoolsEnabled: true,
  },
}));

vi.mock('@/auth/services/AccessTokenRefreshCoordinator', () => ({
  AccessTokenRefreshCoordinator: vi.fn(),
}));

vi.mock('./links/tokenRefreshErrorLink', () => ({
  createTokenRefreshErrorLink: vi.fn(() => mocks.mockTokenRefreshErrorLink),
}));

import { createTokenRefreshErrorLink } from './links/tokenRefreshErrorLink';
import { loggerContext } from '@/logger/context/LoggerContextStore';
import {
  createCitiesConnection,
  createCityEdge,
  createMergeOptions,
} from '@/common/testing/fixtures/apolloClient.fixture';
import {
  getSavedCitiesPaginationMerge,
  getTokenRefreshFailureHandler,
} from '@/common/testing/helpers/apolloClient.helpers';
import {
  setWindowLocation,
  setupApolloClientRuntime,
} from '@/common/testing/runtimes/apolloClient.runtime';
import { createTestApolloClient } from '@/common/testing/setups/apolloClient.setup';

describe('createApolloClient', () => {
  beforeEach(() => {
    setupApolloClientRuntime(mocks);
  });

  it('creates apollo client', () => {
    createTestApolloClient();

    expect(mocks.mockHttpLink).toHaveBeenCalledWith({
      uri: 'http://localhost/graphql',
      credentials: 'include',
    });

    expect(createTokenRefreshErrorLink).toHaveBeenCalledTimes(1);
    expect(mocks.mockApolloLinkFrom).toHaveBeenCalledTimes(1);
    expect(mocks.mockApolloClient).toHaveBeenCalledWith(
      expect.objectContaining({
        devtools: {
          enabled: true,
          name: 'Weather Forecast',
        },
      }),
    );
  });

  it('handles refresh failure from token refresh link callback', () => {
    const setSpy = vi.spyOn(loggerContext, 'set');

    createTestApolloClient();

    getTokenRefreshFailureHandler()();

    expect(setSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: undefined,
      }),
    );
    expect(window.location.href).toBe('/login');
  });

  it('does not redirect again when token refresh fails on login page', () => {
    setWindowLocation({
      href: 'http://localhost/login',
      pathname: '/login',
    });

    createTestApolloClient();

    getTokenRefreshFailureHandler()();

    expect(window.location.href).toBe('http://localhost/login');
  });

  it('normalizes city outputs by id', () => {
    createTestApolloClient();

    expect(mocks.capturedCacheConfig?.typePolicies.CityOutput).toEqual({
      keyFields: ['id'],
    });
  });

  it('returns incoming data for first page', () => {
    createTestApolloClient();

    const merge = getSavedCitiesPaginationMerge(mocks);
    const incoming = createCitiesConnection({
      edges: [createCityEdge('1')],
    });

    const result = merge(undefined, incoming, createMergeOptions());

    expect(result).toBe(incoming);
  });

  it('merges next page and appends only new cities', () => {
    createTestApolloClient();

    const merge = getSavedCitiesPaginationMerge(mocks);
    const existing = {
      edges: [createCityEdge('1'), createCityEdge('2')],
    };
    const incoming = createCitiesConnection({
      edges: [createCityEdge('2'), createCityEdge('3')],
      pageInfo: {
        hasNextPage: false,
      },
    });

    const result = merge(existing, incoming, createMergeOptions('cursor'));

    expect(result).toEqual({
      __typename: 'CitiesConnection',
      edges: [createCityEdge('1'), createCityEdge('2'), createCityEdge('3')],
      pageInfo: {
        hasNextPage: false,
      },
    });
  });

  it('does not append duplicate cities', () => {
    createTestApolloClient();

    const merge = getSavedCitiesPaginationMerge(mocks);
    const result = merge(
      {
        edges: [createCityEdge('1')],
      },
      createCitiesConnection({
        edges: [createCityEdge('1')],
      }),
      createMergeOptions('next-page'),
    ) as { edges: unknown[] };

    expect(result.edges).toHaveLength(1);
  });

  it('handles missing edges collections', () => {
    createTestApolloClient();

    const merge = getSavedCitiesPaginationMerge(mocks);
    const result = merge(
      {},
      createCitiesConnection({
        pageInfo: {
          hasNextPage: false,
        },
      }),
      createMergeOptions('next-page'),
    );

    expect(result).toEqual({
      __typename: 'CitiesConnection',
      edges: [],
      pageInfo: {
        hasNextPage: false,
      },
    });
  });

  it('merges next page when existing connection is missing', () => {
    createTestApolloClient();

    const merge = getSavedCitiesPaginationMerge(mocks);
    const incoming = createCitiesConnection({
      edges: [createCityEdge('1')],
    });

    const result = merge(undefined, incoming, createMergeOptions('next-page'));

    expect(result).toEqual(incoming);
  });

  it('merges next page when incoming edges are missing', () => {
    createTestApolloClient();

    const merge = getSavedCitiesPaginationMerge(mocks);
    const result = merge(
      {
        edges: [createCityEdge('1')],
      },
      {
        __typename: 'CitiesConnection',
        pageInfo: {},
      },
      createMergeOptions('next-page'),
    );

    expect(result).toEqual({
      __typename: 'CitiesConnection',
      edges: [createCityEdge('1')],
      pageInfo: {},
    });
  });
});
