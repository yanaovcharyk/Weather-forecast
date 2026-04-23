import { AuthProvider } from './AuthProvider';
import { ApolloProviderWithAuth } from './ApolloProviderWithAuth';
import { ToastProvider } from './ToastProvider';
import { ThemeProvider } from './ThemeProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <ApolloProviderWithAuth>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </ApolloProviderWithAuth>
  </ToastProvider>
);
