import type { AppRoute } from './AppRoute';

export interface IRoutableModule {
  name: string;
  routes: AppRoute[];
}
