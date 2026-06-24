import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { AuthContext } from '@/auth/contexts/AuthContext';

describe('AuthContext default value', () => {
  it('calls login and logout functions', () => {
    const { result } = renderHook(() => useContext(AuthContext));

    result.current.login();
    result.current.logout();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });
});
