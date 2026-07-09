import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Logger } from './LoggerService';
import { loggerQueue } from './LoggerQueueService';
import { loggerContext } from '@/logger/context/LoggerContextStore';
import { loggerRateLimiter } from './LoggerRateLimiter';
import { sanitizeForLogging } from '@/logger/utils/sanitizeForLogging';
import { shouldLog } from '@/logger/utils/shouldLog';
import { LoggerOperation } from './LoggerOperation';
import { config } from '@/common/config';
import type { JsonValue } from '@/logger/types';
import { LogLevel } from '@/logger/types';

vi.mock('./LoggerQueueService', () => ({
  loggerQueue: {
    addLog: vi.fn(),
  },
}));

vi.mock('./LoggerRateLimiter', () => ({
  loggerRateLimiter: {
    registerLogEvent: vi.fn(),
  },
}));

vi.mock('@/logger/context/LoggerContextStore', () => ({
  loggerContext: {
    get: vi.fn(),
  },
}));

vi.mock('@/logger/utils/sanitizeForLogging', () => ({
  sanitizeForLogging: vi.fn(),
}));

vi.mock('@/logger/utils/shouldLog', () => ({
  shouldLog: vi.fn(),
}));

vi.mock('./LoggerOperation');

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    vi.clearAllMocks();

    logger = new Logger({
      module: 'weather',
    });

    vi.mocked(shouldLog).mockReturnValue(true);

    vi.mocked(loggerContext.get).mockReturnValue({
      route: '/weather',
      sessionId: 'session-123',
    });

    vi.mocked(sanitizeForLogging).mockImplementation(
      (metadata: unknown) => metadata as JsonValue | undefined,
    );

    config.isLoggerConsole = false;

    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  describe('child()', () => {
    it('creates logger with merged metadata', () => {
      const childLogger = logger.child({
        city: 'Kyiv',
      });

      childLogger.info('weather.loaded');

      expect(loggerQueue.addLog).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            module: 'weather',
            city: 'Kyiv',
          },
        }),
      );
    });
  });

  describe('operation()', () => {
    it('creates logger operation instance', () => {
      logger.operation('weather.fetch');

      expect(LoggerOperation).toHaveBeenCalledWith(
        logger,
        'weather.fetch',
        undefined,
      );
    });
  });

  describe('info()', () => {
    it('creates info log record', () => {
      logger.info('weather.loaded', {
        city: 'Kyiv',
      });

      expect(loggerRateLimiter.registerLogEvent).toHaveBeenCalled();

      expect(loggerQueue.addLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: LogLevel.Info,
          message: 'weather.loaded',
          route: '/weather',
          sessionId: 'session-123',
          metadata: {
            module: 'weather',
            city: 'Kyiv',
          },
        }),
      );
    });
  });

  describe('warn()', () => {
    it('creates warn log record', () => {
      logger.warn('weather.cache.miss');

      expect(loggerQueue.addLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: LogLevel.Warn,
          message: 'weather.cache.miss',
        }),
      );
    });
  });

  describe('error()', () => {
    it('creates error log record', () => {
      logger.error('weather.failed');

      expect(loggerQueue.addLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: LogLevel.Error,
          message: 'weather.failed',
        }),
      );
    });
  });

  describe('debug()', () => {
    it('creates debug log record', () => {
      logger.debug('weather.debug');

      expect(loggerQueue.addLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: LogLevel.Debug,
          message: 'weather.debug',
        }),
      );
    });
  });

  describe('logging conditions', () => {
    it('does not create log when shouldLog returns false', () => {
      vi.mocked(shouldLog).mockReturnValue(false);

      logger.info('weather.loaded');

      expect(loggerRateLimiter.registerLogEvent).not.toHaveBeenCalled();

      expect(loggerQueue.addLog).not.toHaveBeenCalled();
    });
  });

  describe('metadata sanitization', () => {
    it('sanitizes metadata before dispatching log', () => {
      vi.mocked(sanitizeForLogging).mockReturnValue({
        token: '***',
      });

      logger.info('auth.login', {
        token: 'secret',
      });

      expect(sanitizeForLogging).toHaveBeenCalled();

      expect(loggerQueue.addLog).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            token: '***',
          },
        }),
      );
    });
  });

  describe('console logging', () => {
    beforeEach(() => {
      config.isLoggerConsole = true;
    });

    it('prints info logs into browser console', () => {
      logger.info('weather.loaded');

      expect(console.info).toHaveBeenCalled();
    });

    it('prints warn logs into browser console', () => {
      logger.warn('weather.warning');

      expect(console.warn).toHaveBeenCalled();
    });

    it('prints error logs into browser console', () => {
      logger.error('weather.error');

      expect(console.error).toHaveBeenCalled();
    });

    it('prints debug logs into browser console', () => {
      logger.debug('weather.debug');

      expect(console.debug).toHaveBeenCalled();
    });
  });
});
