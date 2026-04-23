import { InMemoryCache } from '@apollo/client';
import { ApolloClient, HttpLink } from '@apollo/client';

export const createApolloClient = () => {
  const graphQLHttpLink = new HttpLink({
    uri: import.meta.env.VITE_API_BASE + '/graphql',
    credentials: 'include',
  });

  return new ApolloClient({
    link: graphQLHttpLink,
    cache: new InMemoryCache(),
  });
};
