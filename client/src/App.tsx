import { AppRouter, providers } from '@/common/components/Routers';
import './App.css';
import { ProviderComposer } from './modules/common/providers';

export const App = () => (
  <ProviderComposer providers={providers}>
    <AppRouter />
  </ProviderComposer>
);
