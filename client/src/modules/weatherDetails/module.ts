import type { IRoutableModule, AppRoute } from '@/common/types';
import { CityDetailsPage } from './pages/CityDetailsPage';

class WeatherDetailsModule implements IRoutableModule {
  name = 'weatherDetails';

  routes: AppRoute[] = [
    {
      path: '/cities/:id',
      component: CityDetailsPage,
      guard: 'auth',
    },
  ];
}

export default new WeatherDetailsModule();
