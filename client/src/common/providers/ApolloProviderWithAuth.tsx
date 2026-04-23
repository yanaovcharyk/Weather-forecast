import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { createApolloClient } from '../../common/api/apollo';

interface Props {
  children: React.ReactNode;
}

export const ApolloProviderWithAuth = ({ children }: Props) => {
  const client = useMemo(() => {
    return createApolloClient();
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
