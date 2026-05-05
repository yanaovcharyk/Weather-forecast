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
        Query: {
          fields: {
            citiesPaginated: {
              keyArgs: ['sorting'],

              merge(existing, incoming, { readField }) {
                const merged = existing?.edges ? [...existing.edges] : [];

                for (const edge of incoming.edges) {
                  const id = readField('id', edge.node);

                  if (!merged.some((e) => readField('id', e.node) === id)) {
                    merged.push(edge);
                  }
                }

                return {
                  ...incoming,
                  edges: merged,
                };
              },
            },
          },
        },
      },
    }),
  });
};
