import { useAuthContext } from '@/auth/contexts/AuthContext';

export const AuthStateProbe = () => {
  const value = useAuthContext();

  return (
    <>
      <span data-testid="auth">{String(value.isAuthenticated)}</span>
      <span data-testid="auth-loading">{String(value.isLoading)}</span>
      <span data-testid="current-user">{value.currentUser?.email ?? ''}</span>
      <button onClick={value.refreshSession}>refresh session</button>
      <button onClick={value.logout}>logout</button>
    </>
  );
};
