import { useMemo, useCallback, useEffect, type ReactNode } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import { LOGOUT_MUTATION, ME_QUERY } from '@/auth/graphql';
import { AuthContext } from '@/auth/contexts/AuthContext';
import { loggerContext } from '@/logger/context/LoggerContextStore';
import type { ILogoutMutationResponse, IMeQuery } from '@/auth/types';

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const { data, loading, refetch } = useQuery<IMeQuery>(ME_QUERY, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });
  const [logoutMutation] =
    useMutation<ILogoutMutationResponse>(LOGOUT_MUTATION);
  const client = useApolloClient();

  const currentUser = data?.me ?? null;
  const userId = currentUser?.id;

  const isAuthenticated = !!userId;

  useEffect(() => {
    loggerContext.set({
      ...loggerContext.get(),
      userId: userId ?? undefined,
    });
  }, [userId]);

  const refreshSession = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } finally {
      loggerContext.set({
        ...loggerContext.get(),
        userId: undefined,
      });

      await client.clearStore();

      window.location.href = '/login';
    }
  }, [client, logoutMutation]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      isLoading: loading,
      logout,
      refreshSession,
    }),
    [currentUser, isAuthenticated, loading, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
