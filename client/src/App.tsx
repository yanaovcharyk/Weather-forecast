import { BrowserRouter } from 'react-router-dom';
import {
  AppProvider,
  ProviderComposer,
  type ProviderEntry,
} from '@/common/providers';
import { AppRouter } from '@/common/components/Routers';
import { App as AntApp } from 'antd';
import './App.css';
import { ErrorBoundary } from '@/logger/components';
import { RouteLoggerProvider } from '@/logger/providers/';

const appProviders: ProviderEntry[] = [
  { component: AntApp },
  { component: AppProvider },
  { component: BrowserRouter },
  { component: RouteLoggerProvider },
  { component: ErrorBoundary },
];

export const App = () => (
  <ProviderComposer providers={appProviders}>
    <AppRouter />
  </ProviderComposer>
);
