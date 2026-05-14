import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AppProviders } from '@/common/providers';
import { AppRouter } from '@/common/components/Routers';
import { App as AntApp } from 'antd';

export const App = () => (
  <AntApp>
    <AppProviders>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProviders>
  </AntApp>
);
