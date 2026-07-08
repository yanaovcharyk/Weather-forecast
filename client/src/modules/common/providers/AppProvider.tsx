import type { ReactNode } from 'react';

import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from '@/auth/providers';
import { ToastProvider } from './ToastProvider';
import { LoggerContextProvider } from '@/logger';
import { AppApolloProvider } from '@/common/api/apollo';
import {
  ProviderComposer,
  type ProviderEntry,
} from '@/common/providers/ProviderComposer';

const appProviders: ProviderEntry[] = [
  { component: ToastProvider },
  { component: LoggerContextProvider },
  { component: AppApolloProvider },
  { component: AuthProvider },
  { component: ThemeProvider },
];

export const AppProvider = ({ children }: { children?: ReactNode }) => (
  <ProviderComposer providers={appProviders}>{children}</ProviderComposer>
);
