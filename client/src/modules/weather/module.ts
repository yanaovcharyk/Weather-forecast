import type { IAppModule } from '@/common/types';
import { CitiesPage, CityDetailsPage } from './pages';

const weatherModule: IAppModule = {
  name: 'weather',
  routes: [
    {
      path: '/',
      component: CitiesPage,
      guard: 'auth',
    },
    {
      path: '/cities/:id',
      component: CityDetailsPage,
      guard: 'auth',
    },
  ],
};

export default weatherModule;
