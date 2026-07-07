import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { AuthContext, useAuthContext } from '@/auth/contexts/AuthContext';

describe('AuthContext', () => {
  it('defaults to null', () => {
    const { result } = renderHook(() => useContext(AuthContext));

    expect(result.current).toBeNull();
  });

  it('throws when useAuthContext is used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuthContext())).toThrow(
      'Auth must be used within AuthProvider',
    );
  });
});
