import type { AppRoute, IRoutableModule } from '@/common/types';
import { LoginPage } from './pages/LoginPage';

class AuthModule implements IRoutableModule {
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
