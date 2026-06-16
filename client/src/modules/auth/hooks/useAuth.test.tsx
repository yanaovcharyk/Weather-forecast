import { renderHook } from '@testing-library/react';
import { AuthContext } from '../contexts/AuthContext';
import { useAuth } from './useAuth';
import { createAuthMock } from '@/test/mocks/auth.mock';

const wrapper = ({ children }: React.PropsWithChildren) => (
  <AuthContext.Provider value={createAuthMock({ isAuthenticated: true })}>
    {children}
  </AuthContext.Provider>
);

describe('useAuth', () => {
  it('returns auth context value', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });
});
