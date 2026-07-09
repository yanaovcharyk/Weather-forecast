import type { IClientLogRecord } from '@/logger/types';
import { LogLevel } from '@/logger/types';

export const createLogRecord = (
  overrides: Partial<IClientLogRecord> = {},
): IClientLogRecord => ({
  timestamp: new Date().toISOString(),
  level: LogLevel.Info,
  message: 'test',
  ...overrides,
});
