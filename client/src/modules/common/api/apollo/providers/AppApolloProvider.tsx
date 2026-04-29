import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { createApolloClient } from '..';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useToast } from '../../../hooks/useToast';

interface AppApolloProviderProps {
  children: React.ReactNode;
}

export const AppApolloProvider = ({ children }: AppApolloProviderProps) => {
  const { logout } = useAuth();
  const { toast } = useToast();

  const client = useMemo(() => {
    return createApolloClient({
      performLogout: logout,
      displayErrorMessage: (message: string) => {
        toast('error', message);
      },
    });
  }, [logout, toast]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
