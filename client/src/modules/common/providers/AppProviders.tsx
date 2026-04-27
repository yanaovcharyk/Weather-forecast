import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from '@/modules/auth/providers/AuthProvider';
import { ApolloProviderWithAuth } from '../api/apollo/providers/ApolloProviderWithAuth';
import { ToastProvider } from './ToastProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <ApolloProviderWithAuth>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </ApolloProviderWithAuth>
  </ToastProvider>
);
