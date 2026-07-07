import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthProvider } from '@/auth/providers/AuthProvider';
import { AuthStateProbe } from './AuthStateProbe';

export const setupAuthProvider = () => {
  const user = userEvent.setup();

  render(
    <AuthProvider>
      <AuthStateProbe />
    </AuthProvider>,
  );

  return {
    user,
    authState: () => screen.getByTestId('auth'),
    authLoadingState: () => screen.getByTestId('auth-loading'),
    currentUser: () => screen.getByTestId('current-user'),
    refreshSessionButton: () =>
      screen.getByRole('button', {
        name: 'refresh session',
      }),
    logoutButton: () =>
      screen.getByRole('button', {
        name: 'logout',
      }),
  };
};
