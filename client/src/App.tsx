import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/common/providers';
import { AppRouter } from '@/common/components/Routers';
import { App as AntApp } from 'antd';
import './App.css';
import { ErrorBoundary } from './modules/common/components/ErrorBoundary/ErrorBoundary';
import { RouteLoggerProvider } from './modules/logger/providers/RouteLoggerProvider';

export const App = () => (
  <AntApp>
    <AppProvider>
      <BrowserRouter>
        <RouteLoggerProvider>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </RouteLoggerProvider>
      </BrowserRouter>
    </AppProvider>
  </AntApp>
);
