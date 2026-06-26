import { createLoginContext, type LoginContext } from '@/auth/testing/contexts';
import {
  LOGIN_FAIL_RESPONSE,
  LOGIN_FIXTURE,
  LOGIN_SUCCESS_RESPONSE,
} from '@/auth/testing/fixtures';
import { setupLoginRuntime } from '@/auth/testing/runtimes/login.runtime';
import { setupLogin } from '@/auth/testing/setups/login.setup';

vi.mock('@apollo/client/react');
vi.mock('./useAuth');
vi.mock('@/common/hooks/useToast');

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('useLogin', () => {
  let ctx: LoginContext;

  beforeEach(() => {
    ctx = createLoginContext();
    setupLoginRuntime(ctx);
  });

  it('returns loading state', () => {
    setupLoginRuntime(ctx, {
      loading: true,
    });
    const { result } = setupLogin();
    expect(result.current.loading).toBe(true);
  });

  it('logs user in successfully', async () => {
    ctx.mutate.mockResolvedValue(LOGIN_SUCCESS_RESPONSE);

    const { login } = setupLogin();

    await login(LOGIN_FIXTURE.email, LOGIN_FIXTURE.password);

    expect(ctx.login).toHaveBeenCalled();
    expect(ctx.toast).toHaveBeenCalledWith('success', 'Logged in successfully');
    expect(ctx.navigate).toHaveBeenCalledWith('/');
  });

  it('handles invalid credentials', async () => {
    ctx.mutate.mockResolvedValue(LOGIN_FAIL_RESPONSE);

    const { login } = setupLogin();

    await login(LOGIN_FIXTURE.email, LOGIN_FIXTURE.wrongPassword);

    expect(ctx.login).not.toHaveBeenCalled();
    expect(ctx.toast).toHaveBeenCalledWith(
      'error',
      'Invalid email or password',
    );
  });

  it('handles mutation error', async () => {
    ctx.mutate.mockRejectedValue(new Error('Network error'));

    const { login } = setupLogin();

    await login(LOGIN_FIXTURE.email, LOGIN_FIXTURE.password);

    expect(ctx.toast).toHaveBeenCalled();
  });
});
