import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/common/providers';
import { AppRouter } from '@/common/components/Routers';
import { App as AntApp } from 'antd';
import './App.css';

export const App = () => (
  <AntApp>
    <AppProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProvider>
  </AntApp>
);
