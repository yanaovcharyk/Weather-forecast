import type { IRoutableModule, AppRoute } from '@/common/types';
import { CitiesPage } from './pages/CitiesPage';

class WeatherModule implements IRoutableModule {
  name = 'weatherForecast';

  routes: AppRoute[] = [
    {
      path: '/',
      component: CitiesPage,
      guard: 'auth',
    },
  ];
}

export default new WeatherModule();
