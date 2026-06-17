import { render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { AuthContext } from '../contexts/AuthContext';
import { loggerContext } from '@/logger/context/LoggerContextStore';
import { useQuery } from '@apollo/client/react';
import type { IMeQuery } from '../types';
import type { Mock } from 'vitest';

vi.mock('@apollo/client/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client/react')>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

interface AuthProviderTestContext {
  refetch: Mock;
  render: (
    consumer: (
      value: React.ContextType<typeof AuthContext>,
    ) => React.ReactElement,
  ) => void;
}

const createAuthProviderTestContext = (): AuthProviderTestContext => {
  const refetch = vi.fn();

  (useQuery as unknown as Mock).mockReturnValue({
    data: {},
    loading: false,
    refetch,
  });

  const renderWithProvider = (
    consumer: (
      value: React.ContextType<typeof AuthContext>,
    ) => React.ReactElement,
  ) => {
    return render(
      <AuthProvider>
        <AuthContext.Consumer>{consumer}</AuthContext.Consumer>
      </AuthProvider>,
    );
  };

  return { refetch, render: renderWithProvider };
};

describe('AuthProvider', () => {
  let ctx: AuthProviderTestContext;

  beforeEach(() => {
    vi.clearAllMocks();
    ctx = createAuthProviderTestContext();
  });

  it('provides isAuthenticated=true when userId exists', () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: { me: { userId: '123' } } as IMeQuery,
      loading: false,
      refetch: ctx.refetch,
    });

    ctx.render((value) => (
      <span data-testid="auth">{String(value.isAuthenticated)}</span>
    ));
    expect(screen.getByTestId('auth')).toHaveTextContent('true');
  });

  it('login calls refetch', async () => {
    ctx.render((value) => <button onClick={value.login}>login</button>);
    await screen.getByText('login').click();
    expect(ctx.refetch).toHaveBeenCalled();
  });

  it('logout clears loggerContext and redirects', () => {
    const setSpy = vi.spyOn(loggerContext, 'set');
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    ctx.render((value) => <button onClick={value.logout}>logout</button>);
    screen.getByText('logout').click();

    expect(setSpy).toHaveBeenCalledWith(
      expect.objectContaining({ userId: undefined }),
    );
    expect(window.location.href).toBe('/login');
  });
});
