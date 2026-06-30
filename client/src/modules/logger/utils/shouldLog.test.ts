import { describe, it, expect } from 'vitest';
import { shouldLog } from './shouldLog';
import { config } from '@/common/config';
import { LOG_LEVEL_PRIORITY } from '@/logger/constants';

describe('shouldLog', () => {
  it('returns false when logger disabled', () => {
    config.loggerEnabled = false;

    expect(shouldLog('info')).toBe(false);
  });

  it('respects log level priority', () => {
    config.loggerEnabled = true;
    config.loggerLevel = 'warn';

    expect(shouldLog('error')).toBe(
      LOG_LEVEL_PRIORITY.error >= LOG_LEVEL_PRIORITY.warn,
    );

    expect(shouldLog('debug')).toBe(false);
  });

  it('defaults to info level', () => {
    config.loggerEnabled = true;
    config.loggerLevel = undefined as never;

    expect(shouldLog('info')).toBe(true);
    expect(shouldLog('debug')).toBe(false);
  });
});
