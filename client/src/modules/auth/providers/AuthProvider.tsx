import { useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { ME_QUERY } from '../api/authApi';
import { AuthContext } from '../contexts/AuthContext';
import { loggerContext } from '@/logger/context/LoggerContextStore';
import type { MeQuery } from '../types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, loading, refetch } = useQuery<MeQuery>(ME_QUERY, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const userId = data?.me?.userId;

  const isAuthenticated = !!userId;

  useEffect(() => {
    loggerContext.set({
      ...loggerContext.get(),
      userId: userId ?? undefined,
    });
  }, [userId]);

  const login = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const logout = useCallback(() => {
    loggerContext.set({
      ...loggerContext.get(),
      userId: undefined,
    });

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
