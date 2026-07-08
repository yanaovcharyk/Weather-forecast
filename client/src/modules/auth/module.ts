import type { IAppModule } from '@/common/types';
import { ProviderOrder } from '@/common/providers';
import { AuthProvider } from './providers';
import { LoginPage } from './pages/LoginPage';

const authModule: IAppModule = {
  name: 'auth',
  providers: [{ component: AuthProvider, order: ProviderOrder.Auth }],
  routes: [
    {
      path: '/login',
      component: LoginPage,
      guard: 'guest',
    },
  ],
};

export default authModule;
