import { ApolloProviderWithAuth } from '../../modules/api/apollo/providers/ApolloProviderWithAuth';
import { ThemeProvider } from '../theme/ThemeProvider';
import { AuthProvider } from '../../modules/auth/providers/AuthProvider';
import { ToastProvider } from '../toast/ToastProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <ApolloProviderWithAuth>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </ApolloProviderWithAuth>
  </ToastProvider>
);
