import type { AppModule } from '@/common/types/IAppModule';

const modules = import.meta.glob<{ default: AppModule }>('@/*/module.ts', {
  eager: true,
});

export const registry = Object.values(modules).map((module) => module.default);
