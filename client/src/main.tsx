import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as WeatherApp } from './App';
import { ErrorBoundary } from '@/logger/components';
import { ProviderComposer, type ProviderEntry } from '@/common/providers';

const rootProviders = [
  { component: StrictMode },
  { component: ErrorBoundary },
] satisfies readonly ProviderEntry[];

createRoot(document.getElementById('root')!).render(
  <ProviderComposer providers={rootProviders}>
    <WeatherApp />
  </ProviderComposer>,
);
