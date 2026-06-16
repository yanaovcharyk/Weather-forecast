import { render, screen } from '@testing-library/react';
import { LoginPage } from './LoginPage';

vi.mock('../components/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form" />,
}));

describe('LoginPage', () => {
  it('renders page layout', () => {
    render(<LoginPage />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
