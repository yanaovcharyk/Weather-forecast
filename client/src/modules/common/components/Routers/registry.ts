import type { IAppModule } from '@/common/types/IAppModule';

const modules = import.meta.glob<{ default: IAppModule }>('@/*/module.ts', {
  eager: true,
});

export const registry = Object.values(modules).map((module) => module.default);
