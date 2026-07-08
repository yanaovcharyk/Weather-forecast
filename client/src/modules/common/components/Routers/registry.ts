import type { IAppModule } from '@/common/types';

const modules = import.meta.glob<{ default: IAppModule }>('@/*/module.ts', {
  eager: true,
});

export const appModules = Object.values(modules).map(
  (module) => module.default,
);

export const routes = appModules.flatMap((module) => module.routes ?? []);

export const providers = appModules
  .flatMap((module) => module.providers ?? [])
  .sort((a, b) => a.order - b.order);
