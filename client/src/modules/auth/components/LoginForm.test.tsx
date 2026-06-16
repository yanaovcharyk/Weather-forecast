import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LoginForm } from './LoginForm';
import { useLogin } from '../hooks/useLogin';
vi.mock('../hooks/useLogin');

describe('LoginForm', () => {
  const mockLoginUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useLogin as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      loginUser: mockLoginUser,
      loading: false,
    });
  });

  it('renders form fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('submits form with values', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/password/i), '123456');

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(mockLoginUser).toHaveBeenCalledWith(
      {
        email: 'test@test.com',
        password: '123456',
      },
      expect.anything(),
    );
  });
});
