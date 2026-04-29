import type { AppRoute } from '../common/types/AppRoute';
import type { AppModule } from '../common/types/IAppModule';
import { CitiesPage } from './pages/CitiesPage';

class WeatherModule implements AppModule {
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
