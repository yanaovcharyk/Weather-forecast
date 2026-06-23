import { beforeEach, describe, expect, it, vi } from 'vitest';

type CityNode = {
  id: string;
};

type Edge = {
  node: CityNode;
};

type CacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        citiesPaginated: {
          merge: (
            existing: unknown,
            incoming: unknown,
            options: unknown,
          ) => unknown;
        };
      };
    };
  };
};

const mocks = vi.hoisted(() => ({
  mockApolloClient: vi.fn(),
  mockApolloLinkFrom: vi.fn(() => ({})),
  mockTokenRefreshErrorLink: {},

  capturedCacheConfig: undefined as CacheConfig | undefined,

  mockHttpLink: vi.fn(function (
    this: Record<string, unknown>,
    config: unknown,
  ) {
    Object.assign(this, { config });
  }),

  mockInMemoryCache: vi.fn(function (
    this: Record<string, unknown>,
    config: CacheConfig,
  ) {
    mocks.capturedCacheConfig = config;

    Object.assign(this, { config });
  }),
}));

vi.mock('@apollo/client', async () => {
  const actual =
    await vi.importActual<typeof import('@apollo/client')>('@apollo/client');

  const MockApolloLink = vi.fn(function (
    this: Record<string, unknown>,
    request?: unknown,
  ) {
    Object.assign(this, { request });
  });

  Object.assign(MockApolloLink, {
    from: mocks.mockApolloLinkFrom,
  });

  return {
    ...actual,
    ApolloClient: mocks.mockApolloClient,
    ApolloLink: MockApolloLink,
    HttpLink: mocks.mockHttpLink,
    InMemoryCache: mocks.mockInMemoryCache,
  };
});

vi.mock('@/common/config', () => ({
  config: {
    apiBaseUrl: 'http://localhost',
    graphqlPath: '/graphql',
  },
}));

vi.mock('@/auth/services/AccessTokenRefreshCoordinator', () => ({
  AccessTokenRefreshCoordinator: vi.fn(),
}));

vi.mock('./links/tokenRefreshErrorLink', () => ({
  createTokenRefreshErrorLink: vi.fn(() => mocks.mockTokenRefreshErrorLink),
}));

import { createApolloClient } from './createApolloClient';
import { createTokenRefreshErrorLink } from './links/tokenRefreshErrorLink';

describe('createApolloClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.capturedCacheConfig = undefined;
  });

  it('creates apollo client', () => {
    createApolloClient({
      performLogout: vi.fn(),
      displayErrorMessage: vi.fn(),
    });

    expect(mocks.mockHttpLink).toHaveBeenCalledWith({
      uri: 'http://localhost/graphql',
      credentials: 'include',
    });

    expect(createTokenRefreshErrorLink).toHaveBeenCalledTimes(1);

    expect(mocks.mockApolloLinkFrom).toHaveBeenCalledTimes(1);

    expect(mocks.mockApolloClient).toHaveBeenCalledTimes(1);
  });

  it('returns incoming data for first page', () => {
    createApolloClient({
      performLogout: vi.fn(),
      displayErrorMessage: vi.fn(),
    });

    const merge =
      mocks.capturedCacheConfig?.typePolicies.Query.fields.citiesPaginated
        .merge;

    expect(merge).toBeDefined();

    const incoming = {
      __typename: 'CityConnection',
      edges: [{ node: { id: '1' } }],
      pageInfo: {},
    };

    const result = merge?.(undefined, incoming, {
      args: {
        query: {
          pagination: {},
        },
      },
      readField: vi.fn((_field: string, node: CityNode): string => node.id),
    });

    expect(result).toBe(incoming);
  });

  it('merges next page and appends only new cities', () => {
    createApolloClient({
      performLogout: vi.fn(),
      displayErrorMessage: vi.fn(),
    });

    const merge =
      mocks.capturedCacheConfig?.typePolicies.Query.fields.citiesPaginated
        .merge;

    expect(merge).toBeDefined();

    const existing = {
      edges: [{ node: { id: '1' } }, { node: { id: '2' } }] satisfies Edge[],
    };

    const incoming = {
      __typename: 'CityConnection',
      edges: [{ node: { id: '2' } }, { node: { id: '3' } }] satisfies Edge[],
      pageInfo: {
        hasNextPage: false,
      },
    };

    const result = merge?.(existing, incoming, {
      args: {
        query: {
          pagination: {
            cursor: 'cursor',
          },
        },
      },
      readField: (_field: string, node: CityNode): string => node.id,
    });

    expect(result).toEqual({
      __typename: 'CityConnection',
      edges: [
        { node: { id: '1' } },
        { node: { id: '2' } },
        { node: { id: '3' } },
      ],
      pageInfo: {
        hasNextPage: false,
      },
    });
  });

  it('does not append duplicate cities', () => {
    createApolloClient({
      performLogout: vi.fn(),
      displayErrorMessage: vi.fn(),
    });

    const merge =
      mocks.capturedCacheConfig?.typePolicies.Query.fields.citiesPaginated
        .merge;

    expect(merge).toBeDefined();

    const result = merge?.(
      {
        edges: [{ node: { id: '1' } }] satisfies Edge[],
      },
      {
        __typename: 'CityConnection',
        edges: [{ node: { id: '1' } }] satisfies Edge[],
        pageInfo: {},
      },
      {
        args: {
          query: {
            pagination: {
              cursor: 'next-page',
            },
          },
        },
        readField: (_field: string, node: CityNode): string => node.id,
      },
    ) as { edges: Edge[] };

    expect(result.edges).toHaveLength(1);
  });

  it('handles missing edges collections', () => {
    createApolloClient({
      performLogout: vi.fn(),
      displayErrorMessage: vi.fn(),
    });

    const merge =
      mocks.capturedCacheConfig?.typePolicies.Query.fields.citiesPaginated
        .merge;

    expect(merge).toBeDefined();

    const result = merge?.(
      {},
      {
        __typename: 'CityConnection',
        pageInfo: {
          hasNextPage: false,
        },
      },
      {
        args: {
          query: {
            pagination: {
              cursor: 'next-page',
            },
          },
        },
        readField: (_field: string, node: CityNode): string => node.id,
      },
    );

    expect(result).toEqual({
      __typename: 'CityConnection',
      edges: [],
      pageInfo: {
        hasNextPage: false,
      },
    });
  });
});
