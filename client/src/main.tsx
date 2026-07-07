import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as WeatherApp } from './App';
import { ErrorBoundary } from './modules/logger/components';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <WeatherApp />
    </ErrorBoundary>
  </StrictMode>,
);
