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

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides isAuthenticated=true when userId exists', () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: { me: { userId: '123' } } as IMeQuery,
      loading: false,
      refetch: vi.fn(),
    });

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <span>auth: {String(value.isAuthenticated)}</span>}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    expect(screen.getByText(/auth: true/)).toBeInTheDocument();
  });

  it('login calls refetch', async () => {
    const refetch = vi.fn().mockResolvedValue({});
    (useQuery as unknown as Mock).mockReturnValue({
      data: {},
      loading: false,
      refetch,
    });

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <button onClick={value.login}>login</button>}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    await screen.getByText('login').click();
    expect(refetch).toHaveBeenCalled();
  });

  it('logout clears loggerContext and redirects', () => {
    const setSpy = vi.spyOn(loggerContext, 'set');
    (useQuery as unknown as Mock).mockReturnValue({
      data: { me: { userId: '123' } },
      loading: false,
      refetch: vi.fn(),
    });

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <button onClick={value.logout}>logout</button>}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    screen.getByText('logout').click();

    expect(setSpy).toHaveBeenCalledWith(
      expect.objectContaining({ userId: undefined }),
    );
    expect(window.location.href).toBe('/login');
  });
});
