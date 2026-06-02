import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from '@/auth/providers';
import { ToastProvider } from './ToastProvider';
import { LoggerContextProvider } from '@/logger';
import { AppApolloProvider } from '@/auth/apollo';

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <LoggerContextProvider>
      <AppApolloProvider>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </AppApolloProvider>
    </LoggerContextProvider>
  </ToastProvider>
);
