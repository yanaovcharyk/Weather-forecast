import type { IRoutableModule } from '@/common/types';

const modules = import.meta.glob<{ default: IRoutableModule }>(
  '@/*/module.ts',
  {
    eager: true,
  },
);

export const registry = Object.values(modules).map((module) => module.default);
