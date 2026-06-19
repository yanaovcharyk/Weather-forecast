import {
  createAuthProviderContext,
  type AuthProviderContext,
} from '../../test/auth/contexts/auth-provider.context';

import { setupAuthProviderRuntime } from '../../test/auth/runtimes/auth-provider.runtime';
import { loggerContext } from '../../logger';
import { setupAuthProvider } from '../../test/auth/setups/auth-provider.setup';

vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client/react')>(
    '@apollo/client/react',
  );

  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe('AuthProvider', () => {
  let ctx: AuthProviderContext;

  beforeEach(() => {
    ctx = createAuthProviderContext();

    setupAuthProviderRuntime(ctx);
  });

  it('provides authenticated state', () => {
    ctx.setAuthenticated();

    const { authState } = setupAuthProvider();

    expect(authState()).toHaveTextContent('true');
  });

  it('calls refetch on login', async () => {
    ctx.refetch.mockResolvedValue({});

    const { user, loginButton } = setupAuthProvider();

    await user.click(loginButton());

    expect(ctx.refetch).toHaveBeenCalled();
  });

  it('handles logout', async () => {
    const setSpy = vi.spyOn(loggerContext, 'set');

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    const { user, logoutButton } = setupAuthProvider();

    await user.click(logoutButton());

    expect(setSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: undefined,
      }),
    );

    expect(window.location.href).toBe('/login');
  });
});
