import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';

import { useAuth } from '@/auth/hooks/useAuth';
import { PrivateRoute } from './PrivateRoute';
import { createAuthMock } from '@/common/test/mocks/auth.mock';

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe('PrivateRoute', () => {
  it('should render spinner when authentication is loading', () => {
    mockedUseAuth.mockReturnValue(
      createAuthMock({
        loading: true,
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
    mockedUseAuth.mockReturnValue(
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
    mockedUseAuth.mockReturnValue(
      createAuthMock({
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
