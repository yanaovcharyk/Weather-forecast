import { useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import { ME_QUERY } from '../api/authApi';
import { AuthContext } from '../contexts/AuthContext';

interface MeQuery {
  me: boolean;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, loading, refetch } = useQuery<MeQuery>(ME_QUERY, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const isAuthenticated = !!data?.me;

  const login = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const logout = useCallback(() => {
    window.location.href = '/login';
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
      loading,
    }),
    [login, logout, isAuthenticated, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
