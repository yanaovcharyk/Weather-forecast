import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { AccessTokenRefreshCoordinator } from './AccessTokenRefreshCoordinator';
import { createTokenRefreshErrorLink } from './tokenRefreshErrorLink';

type CreateApolloClientParams = {
  performLogout: () => void;
  displayErrorMessage: (message: string) => void;
};

export const createApolloClient = ({
  performLogout,
  displayErrorMessage,
}: CreateApolloClientParams) => {
  const tokenRefreshCoordinator = new AccessTokenRefreshCoordinator();

  const graphQLHttpLink = new HttpLink({
    uri: import.meta.env.VITE_API_BASE + '/graphql',
    credentials: 'include',
  });

  const tokenRefreshErrorLink = createTokenRefreshErrorLink({
    tokenRefreshCoordinator,
    performLogout,
    displayErrorMessage,
  });

  return new ApolloClient({
    link: ApolloLink.from([tokenRefreshErrorLink, graphQLHttpLink]),
    cache: new InMemoryCache(),
  });
};
