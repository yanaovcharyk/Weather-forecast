import { describe, it, expect } from 'vitest';
import { shouldLog } from '../config/shouldLog';
import { config } from '@/common/config';
import { LOG_LEVEL_PRIORITY } from '@/logger/constants';
import { LogLevel } from '@/logger/types';

describe('shouldLog', () => {
  it('returns false when logger disabled', () => {
    config.loggerEnabled = false;

    expect(shouldLog(LogLevel.Info)).toBe(false);
  });

  it('respects log level priority', () => {
    config.loggerEnabled = true;
    config.loggerLevel = LogLevel.Warn;

    expect(shouldLog(LogLevel.Error)).toBe(
      LOG_LEVEL_PRIORITY[LogLevel.Error] >= LOG_LEVEL_PRIORITY[LogLevel.Warn],
    );

    expect(shouldLog(LogLevel.Debug)).toBe(false);
  });

  it('defaults to info level', () => {
    config.loggerEnabled = true;
    config.loggerLevel = undefined as never;

    expect(shouldLog(LogLevel.Info)).toBe(true);
    expect(shouldLog(LogLevel.Debug)).toBe(false);
  });
});
