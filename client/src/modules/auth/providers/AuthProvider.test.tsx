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
