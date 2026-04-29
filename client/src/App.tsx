import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AppProviders } from '@/common/providers';
import { AppRouter } from '@/common/components/Routers';

export const App = () => (
  <AppProviders>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </AppProviders>
);
