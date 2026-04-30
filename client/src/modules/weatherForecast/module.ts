import type { AppRoute } from '@/common/types/AppRoute';
import type { IAppModule } from '@/common/types/IAppModule';
import { CitiesPage } from './pages/CitiesPage';

class WeatherModule implements IAppModule {
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
