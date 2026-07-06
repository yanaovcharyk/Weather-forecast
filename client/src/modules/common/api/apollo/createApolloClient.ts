import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

import { AccessTokenRefreshCoordinator } from '@/auth/services/AccessTokenRefreshCoordinator';
import { createTokenRefreshErrorLink } from './links/tokenRefreshErrorLink';
import { apolloLoggerLink } from './links/apolloLoggerLink';
import { config } from '@/common/config';

type CreateApolloClientParams = {
  performLogout: () => void;
  displayErrorMessage: (message: string) => void;
};

export const createApolloClient = ({
  performLogout,
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
