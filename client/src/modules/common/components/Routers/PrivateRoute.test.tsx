import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';

import { useAuthContext } from '@/auth/contexts/AuthContext';
import { PrivateRoute } from './PrivateRoute';
import { createAuthMock } from '@/common/testing/mocks/auth.mock';

const currentUser = {
  id: '123',
  email: 'test@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

vi.mock('@/auth/contexts/AuthContext', () => ({
  useAuthContext: vi.fn(),
}));

const mockedUseAuthContext = vi.mocked(useAuthContext);

describe('PrivateRoute', () => {
  it('should render spinner when authentication is loading', () => {
    mockedUseAuthContext.mockReturnValue(
      createAuthMock({
        isLoading: true,
      }),
    );

    render(
      <PrivateRoute>
        <div>Secret</div>
      </PrivateRoute>,
    );

    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('should redirect when user is not authenticated', () => {
    mockedUseAuthContext.mockReturnValue(
      createAuthMock({
        isAuthenticated: false,
      }),
    );

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Secret</div>
        </PrivateRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    mockedUseAuthContext.mockReturnValue(
      createAuthMock({
        currentUser,
        isAuthenticated: true,
      }),
    );

    render(
      <PrivateRoute>
        <div>Secret</div>
      </PrivateRoute>,
    );

    expect(screen.getByText('Secret')).toBeInTheDocument();
  });
});
