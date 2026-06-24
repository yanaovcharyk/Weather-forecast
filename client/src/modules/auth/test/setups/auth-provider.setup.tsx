import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthProvider } from '@/auth/providers/AuthProvider';
import { AuthContext } from '@/auth/contexts/AuthContext';

export const setupAuthProvider = () => {
  const user = userEvent.setup();

  render(
    <AuthProvider>
      <AuthContext.Consumer>
        {(value) => (
          <>
            <span data-testid="auth">{String(value.isAuthenticated)}</span>
            <button onClick={value.login}>login</button>
            <button onClick={value.logout}>logout</button>
          </>
        )}
      </AuthContext.Consumer>
    </AuthProvider>,
  );

  return {
    user,
    authState: () => screen.getByTestId('auth'),
    loginButton: () =>
      screen.getByRole('button', {
        name: 'login',
      }),
    logoutButton: () =>
      screen.getByRole('button', {
        name: 'logout',
      }),
  };
};
