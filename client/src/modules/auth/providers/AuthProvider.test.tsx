import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createAuthProviderContext,
  type AuthProviderContext,
} from '@/auth/testing/contexts';

import { setupAuthProviderRuntime } from '@/auth/testing/runtimes';
import { setupAuthProvider } from '@/auth/testing/setups';
import '@/common/testing/mocks/apollo.mock';
import { loggerContext } from '@/logger';

describe('AuthProvider', () => {
  let ctx: AuthProviderContext;

  beforeEach(() => {
    ctx = createAuthProviderContext();

    setupAuthProviderRuntime(ctx);
  });

  it('provides authenticated state', () => {
    ctx.setAuthenticated();

    const { authState, currentUser } = setupAuthProvider();

    expect(authState()).toHaveTextContent('true');
    expect(currentUser()).toHaveTextContent('test@example.com');
  });

  it('provides loading state', () => {
    const { authLoadingState } = setupAuthProvider();

    expect(authLoadingState()).toHaveTextContent('false');
  });

  it('calls refetch on refresh session', async () => {
    ctx.refetch.mockResolvedValue({});

    const { user, refreshSessionButton } = setupAuthProvider();

    await user.click(refreshSessionButton());

    expect(ctx.refetch).toHaveBeenCalled();
  });

  it('logs out, clears store and redirects to login', async () => {
    const location = { href: '' };
    const setSpy = vi.spyOn(loggerContext, 'set');

    Object.defineProperty(window, 'location', {
      value: location,
      writable: true,
    });

    const { user, logoutButton } = setupAuthProvider();

    await user.click(logoutButton());

    expect(ctx.logoutMutation).toHaveBeenCalledTimes(1);
    expect(ctx.clearStore).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: undefined,
      }),
    );
    expect(window.location.href).toBe('/login');
  });
});
