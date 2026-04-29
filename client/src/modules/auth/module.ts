import type { AppRoute } from '@/common/types/AppRoute';
import type { AppModule } from '@/common/types/IAppModule';
import { LoginPage } from './pages/LoginPage';

class AuthModule implements AppModule {
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
