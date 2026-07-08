import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { createApolloClient } from '..';
import { useToast } from '@/common/hooks/useToast';

interface AppApolloProviderProps {
  children?: ReactNode;
}

export const AppApolloProvider = ({ children }: AppApolloProviderProps) => {
  const { toast } = useToast();

  const client = useMemo(() => {
    return createApolloClient({
      displayErrorMessage: (message: string) => {
        toast('error', message);
      },
    });
  }, [toast]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
