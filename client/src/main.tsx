import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as WeatherApp } from './App';
import { App } from 'antd';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <WeatherApp />
    </App>
  </StrictMode>,
);
