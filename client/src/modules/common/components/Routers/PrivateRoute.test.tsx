import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';

import { useAuth } from '@/auth/hooks/useAuth';
import { PrivateRoute } from './PrivateRoute';
import type { IAuthContextValue } from '@/auth/types';

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

const createAuthContextValue = (
  overrides: Partial<IAuthContextValue> = {},
): IAuthContextValue => ({
  loading: false,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
  ...overrides,
});

describe('PrivateRoute', () => {
  it('should render spinner when authentication is loading', () => {
    mockedUseAuth.mockReturnValue(
      createAuthContextValue({
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
      createAuthContextValue({
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
      createAuthContextValue({
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
