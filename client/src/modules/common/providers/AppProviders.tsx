import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from '@/modules/auth/providers/AuthProvider';
import { ToastProvider } from './ToastProvider';
import { AppApolloProvider } from '../api/apollo/providers/AppApolloProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <AppApolloProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </AppApolloProvider>
  </ToastProvider>
);
