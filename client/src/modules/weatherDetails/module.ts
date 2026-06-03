import type { IRoutableModule, AppRoute } from '@/common/types';
import { CityDetailsPage } from './pages/CityDetailsPage';

class AuthModule implements IRoutableModule {
  name = 'auth';

  routes: AppRoute[] = [
    {
      path: '/cities/:id',
      component: CityDetailsPage,
      guard: 'auth',
    },
  ];
}

export default new AuthModule();
