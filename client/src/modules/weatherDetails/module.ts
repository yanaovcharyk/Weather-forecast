import type { AppRoute } from '@/common/types/AppRoute';
import type { IAppModule } from '@/common/types/IAppModule';
import { CityDetailsPage } from './pages/CityDetailsPage';

class AuthModule implements IAppModule {
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
