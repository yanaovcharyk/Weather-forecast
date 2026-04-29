import type { AppRoute } from './AppRoute';

export interface AppModule {
  name: string;
  routes: AppRoute[];
}
