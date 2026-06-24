import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoggerRateLimiter } from './LoggerRateLimiter';
import { LOGGER_MAX_LOGS_PER_MINUTE } from '@/logger/constants';

describe('LoggerRateLimiter', () => {
  let limiter: LoggerRateLimiter;

  beforeEach(() => {
    limiter = new LoggerRateLimiter();
    vi.clearAllMocks();
  });

  it('allows events below limit', () => {
    for (let i = 0; i < 5; i++) {
      expect(() => {
        limiter.registerLogEvent();
      }).not.toThrow();
    }
  });

  it('throws panic protection error after limit exceeded', () => {
    expect(() => {
      for (let i = 0; i <= LOGGER_MAX_LOGS_PER_MINUTE; i++) {
        limiter.registerLogEvent();
      }
    }).toThrow('Logger panic protection triggered.');
  });
});
