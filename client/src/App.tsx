import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './common/providers/';
import { AppRouter } from './common/routers/';
import './App.css';

export const App = () => (
  <AppProviders>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </AppProviders>
);
