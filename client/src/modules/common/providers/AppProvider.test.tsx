import { render, screen } from '@testing-library/react';
import { AppProvider } from './AppProvider';

vi.mock('./ThemeProvider', () => ({
  ThemeProvider: ({ children }: React.PropsWithChildren) => children,
}));

vi.mock('@/auth/providers', () => ({
  AuthProvider: ({ children }: React.PropsWithChildren) => children,
}));

vi.mock('./ToastProvider', () => ({
  ToastProvider: ({ children }: React.PropsWithChildren) => children,
}));

vi.mock('@/logger', () => ({
  LoggerContextProvider: ({ children }: React.PropsWithChildren) => children,
}));

vi.mock('@/common/api/apollo', () => ({
  AppApolloProvider: ({ children }: React.PropsWithChildren) => children,
}));

describe('AppProvider', () => {
  it('should render nested children', () => {
    render(
      <AppProvider>
        <div>Application</div>
      </AppProvider>,
    );

    expect(screen.getByText('Application')).toBeInTheDocument();
  });
});
