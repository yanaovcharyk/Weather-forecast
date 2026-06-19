import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LoginForm } from './LoginForm';
import { useLogin } from '@/auth/hooks/useLogin';
import { LOGIN_FIXTURE } from '@/test/auth/fixtures/login.fixture';
import {
  createLoginFormContext,
  type LoginFormContext,
} from '@/test/auth/contexts/login-form.context';

vi.mock('@/auth/hooks/useLogin');

describe('LoginForm', () => {
  let ctx: LoginFormContext;

  const setup = () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    return {
      user,
      emailInput: screen.getByLabelText(/email/i),
      passwordInput: screen.getByLabelText(/password/i),
      submitButton: screen.getByRole('button', {
        name: /login/i,
      }),
    };
  };

  beforeEach(() => {
    ctx = createLoginFormContext();

    vi.mocked(useLogin).mockReturnValue({
      loginUser: ctx.loginUser,
      loading: false,
    });
  });

  it('renders form fields', () => {
    const { emailInput, passwordInput } = setup();

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('submits form with values', async () => {
    const { user, emailInput, passwordInput, submitButton } = setup();

    await user.type(emailInput, LOGIN_FIXTURE.email);
    await user.type(passwordInput, LOGIN_FIXTURE.password);

    await user.click(submitButton);

    expect(ctx.loginUser).toHaveBeenCalled();
    expect(ctx.loginUser.mock.calls[0][0]).toEqual({
      email: LOGIN_FIXTURE.email,
      password: LOGIN_FIXTURE.password,
    });
  });

  it('does not submit when form is empty', async () => {
    const { user, submitButton } = setup();

    await user.click(submitButton);

    expect(ctx.loginUser).not.toHaveBeenCalled();
  });
});
