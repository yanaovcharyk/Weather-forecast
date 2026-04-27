import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AppProviders } from './modules/common/providers';
import { AppRouter } from './modules/common/components/Routers';

export const App = () => (
  <AppProviders>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </AppProviders>
);
