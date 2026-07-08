import { createRoot } from 'react-dom/client';
import { App as WeatherApp } from './App';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeatherApp />
  </StrictMode>,
);
