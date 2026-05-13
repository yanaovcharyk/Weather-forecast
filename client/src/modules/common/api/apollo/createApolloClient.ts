import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

import { AccessTokenRefreshCoordinator } from './auth/AccessTokenRefreshCoordinator';
import { createTokenRefreshErrorLink } from './links/tokenRefreshErrorLink';

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
    uri: import.meta.env.VITE_API_BASE + '/graphql',
    credentials: 'include',
  });

  const tokenRefreshErrorLink = createTokenRefreshErrorLink({
    tokenRefreshCoordinator,
    performLogout,
    displayErrorMessage,
  });

  return new ApolloClient({
    link: ApolloLink.from([tokenRefreshErrorLink, httpLink]),

    cache: new InMemoryCache({
      typePolicies: {
        City: {
          keyFields: ['id'],
        },

        Query: {
          fields: {
            citiesPaginated: {
              keyArgs(args) {
                return JSON.stringify({
                  sorting: args?.query?.sorting,
                  showPinnedOnly: args?.query?.showPinnedOnly,
                });
              },

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
