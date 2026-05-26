import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/common/providers';
import { AppRouter } from '@/common/components/Routers';
import { App as AntApp } from 'antd';
import './App.css';
import { ErrorBoundary } from './modules/common/components/ErrorBoundary/ErrorBoundary';
import { RouteLogger } from './modules/logger/RouteLogger';

export const App = () => (
  <AntApp>
    <AppProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <RouteLogger />
          <AppRouter />
        </ErrorBoundary>
      </BrowserRouter>
    </AppProvider>
  </AntApp>
);
