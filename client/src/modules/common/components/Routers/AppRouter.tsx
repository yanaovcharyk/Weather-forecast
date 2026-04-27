import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/modules/auth/pages/';
import { PrivateRoute } from './PrivateRoute';
import { CitiesPage } from '@/modules/weatherForecast/pages/';

export const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <CitiesPage />
        </PrivateRoute>
      }
    />
  </Routes>
);
