import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as WeatherApp } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeatherApp />
  </StrictMode>,
);
