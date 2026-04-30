import type { AppRoute } from './AppRoute';

export interface IAppModule {
  name: string;
  routes: AppRoute[];
}
