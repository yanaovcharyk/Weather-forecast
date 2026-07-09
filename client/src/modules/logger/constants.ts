import { LogLevel } from './types';

export const LOGGER_BATCH_SIZE = 20;
export const LOGGER_FLUSH_INTERVAL_IN_MS = 60000;

export const LOGGER_MAX_RETRY_COUNT = 5;
export const LOGGER_RETRY_DELAY_IN_MS = 3000;

export const LOGGER_MAX_LOGS_PER_MINUTE = 3000;
export const LOGGER_RATE_LIMIT_WINDOW_IN_MS = 60000;

export const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.Debug]: 0,
  [LogLevel.Info]: 1,
  [LogLevel.Warn]: 2,
  [LogLevel.Error]: 3,
};
