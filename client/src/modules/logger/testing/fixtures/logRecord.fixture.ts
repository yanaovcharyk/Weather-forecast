import type { IClientLogRecord } from '@/logger/types';

export const createLogRecord = (
  overrides: Partial<IClientLogRecord> = {},
): IClientLogRecord => ({
  timestamp: new Date().toISOString(),
  level: 'info',
  message: 'test',
  ...overrides,
});
