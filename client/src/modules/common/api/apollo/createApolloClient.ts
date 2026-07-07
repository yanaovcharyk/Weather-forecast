import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { print } from 'graphql';

import { AccessTokenRefreshCoordinator } from '@/auth/services/AccessTokenRefreshCoordinator';
import { LOGOUT_MUTATION } from '@/auth/graphql';
import { createTokenRefreshErrorLink } from './links/tokenRefreshErrorLink';
import { apolloLoggerLink } from './links/apolloLoggerLink';
import { config } from '@/common/config';
import { loggerContext } from '@/logger/context/LoggerContextStore';

type CreateApolloClientParams = {
  displayErrorMessage: (message: string) => void;
};

const performLogout = async () => {
  try {
    await fetch(config.apiBaseUrl + config.graphqlPath, {
      method: 'POST',
      credentials: 'include',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: print(LOGOUT_MUTATION),
      }),
    });
  } finally {
    loggerContext.set({
      ...loggerContext.get(),
      userId: undefined,
    });

    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
};

export const createApolloClient = ({
  displayErrorMessage,
}: CreateApolloClientParams) => {
  const tokenRefreshCoordinator = new AccessTokenRefreshCoordinator();

  const httpLink = new HttpLink({
    uri: config.apiBaseUrl + config.graphqlPath,
    credentials: 'include',
  });

  const tokenRefreshErrorLink = createTokenRefreshErrorLink({
    tokenRefreshCoordinator,
    performLogout,
    displayErrorMessage,
  });

  return new ApolloClient({
    devtools: {
      enabled: config.apolloDevtools || import.meta.env.DEV,
      name: 'Weather Forecast',
    },

    link: ApolloLink.from([apolloLoggerLink, tokenRefreshErrorLink, httpLink]),

    cache: new InMemoryCache({
      typePolicies: {
        CityOutput: {
          keyFields: ['id'],
        },

        Query: {
          fields: {
            getSavedCitiesPaginated: {
              keyArgs: ['query', ['sorting', 'showPinnedOnly']],

              merge(existing, incoming, { args, readField }) {
                const isFirstPage = !args?.query?.pagination?.cursor;

                if (isFirstPage) {
                  return incoming;
                }

                const existingEdges = existing?.edges ?? [];
                const incomingEdges = incoming?.edges ?? [];
                const mergedEdges = [...existingEdges];

                for (const edge of incomingEdges) {
                  const nodeId = readField('id', edge.node);

                  const alreadyExists = mergedEdges.some(
                    (existingEdge) =>
                      readField('id', existingEdge.node) === nodeId,
                  );

                  if (!alreadyExists) {
                    mergedEdges.push(edge);
                  }
                }

                return {
                  __typename: incoming.__typename,
                  edges: mergedEdges,
                  pageInfo: incoming.pageInfo,
                };
              },
            },
          },
        },
      },
    }),
  });
};
