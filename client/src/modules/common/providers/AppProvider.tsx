import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from '@/auth/providers';
import { ToastProvider } from './ToastProvider';
import { AppApolloProvider } from '../api/apollo';

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <AppApolloProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </AppApolloProvider>
  </ToastProvider>
);
