import { act } from '@testing-library/react';

import { useLogin } from './useLogin';
import { useMutation } from '@apollo/client/react';
import { extractErrorCode, mapErrorCodeToMessage } from '@/common/utils';
import { createUseLoginTestContext } from '../../test/auth/setup/useLogin.setup';
import {
  loginFailFixture,
  loginSuccessFixture,
  mutationFailResponse,
  mutationSuccessResponse,
} from '../../test/auth/fixtures/useLogin.fixtures';
import { testRenderHook } from '../../test/render/renderWithProviders';
import { setupUseLoginRuntime } from '../../test/auth/contexts/useLogin.runtime';

vi.mock('@apollo/client/react');
vi.mock('./useAuth');
vi.mock('@/common/hooks/useToast');
vi.mock('@/common/utils');

describe('useLogin', () => {
  const ctx = createUseLoginTestContext();
  const setupRuntime = setupUseLoginRuntime(ctx);

  beforeEach(() => {
    setupRuntime();
  });

  it('returns loading state', () => {
    vi.mocked(useMutation).mockReturnValue([
      ctx.mutate,
      {
        loading: true,
        data: undefined,
        error: undefined,
        called: false,
        client: {} as never,
        reset: vi.fn(),
      },
    ]);

    const { result } = testRenderHook(() => useLogin());

    expect(result.current.loading).toBe(true);
  });

  it('logs user in successfully', async () => {
    ctx.mutate.mockResolvedValue(mutationSuccessResponse);

    const { result } = testRenderHook(() => useLogin());

    await act(async () => {
      await result.current.loginUser(loginSuccessFixture);
    });

    expect(ctx.mutate).toHaveBeenCalled();
    expect(ctx.login).toHaveBeenCalled();
    expect(ctx.toast).toHaveBeenCalledWith('success', 'Logged in successfully');
  });

  it('shows error on login failure', async () => {
    ctx.mutate.mockResolvedValue(mutationFailResponse);

    const { result } = testRenderHook(() => useLogin());

    await act(async () => {
      await result.current.loginUser(loginFailFixture);
    });

    expect(ctx.login).not.toHaveBeenCalled();
    expect(ctx.toast).toHaveBeenCalledWith(
      'error',
      'Invalid email or password',
    );
  });

  it('handles mutation errors', async () => {
    const error = new Error('Network error');

    ctx.mutate.mockRejectedValue(error);

    vi.mocked(extractErrorCode).mockReturnValue('INVALID_CREDENTIALS');
    vi.mocked(mapErrorCodeToMessage).mockReturnValue('Please login again');

    const { result } = testRenderHook(() => useLogin());

    await act(async () => {
      await result.current.loginUser(loginSuccessFixture);
    });

    expect(ctx.toast).toHaveBeenCalledWith('error', 'Please login again');
  });
});
