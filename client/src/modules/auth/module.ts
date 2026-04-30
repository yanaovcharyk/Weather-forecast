import type { AppRoute } from '@/common/types/AppRoute';
import type { IAppModule } from '@/common/types/IAppModule';
import { LoginPage } from './pages/LoginPage';

class AuthModule implements IAppModule {
  name = 'auth';

  routes: AppRoute[] = [
    {
      path: '/login',
      component: LoginPage,
      guard: 'guest',
    },
  ];
}

export default new AuthModule();
