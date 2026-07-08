import type { ProviderEntry } from '@/common/providers/ProviderComposer';
import type { AppRoute } from './AppRoute';

export interface IAppModule {
  name: string;
  routes?: AppRoute[];
  providers?: ProviderEntry[];
}
