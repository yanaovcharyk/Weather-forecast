import type { Mock } from 'vitest';

export type CityNode = {
  id: string;
};

export type CityEdge = {
  node: CityNode;
};

export type ApolloClientCacheConfig = {
  typePolicies: {
    CityOutput: {
      keyFields: string[];
    };

    Query: {
      fields: {
        getSavedCitiesPaginated: {
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

export type ApolloClientPackageMocks = {
  mockApolloClient: Mock;
  mockApolloLinkFrom: Mock;
  mockTokenRefreshErrorLink: Record<string, never>;
  capturedCacheConfig: ApolloClientCacheConfig | undefined;
  mockHttpLink: Mock;
  mockInMemoryCache: Mock;
};
