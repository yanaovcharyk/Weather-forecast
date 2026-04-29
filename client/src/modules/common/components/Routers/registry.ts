import type { AppModule } from '../../types/IAppModule';

const modules = import.meta.glob<{ default: AppModule }>(
  '@/modules/*/module.ts',
  { eager: true },
);

export const registry = Object.values(modules).map((m) => m.default);
