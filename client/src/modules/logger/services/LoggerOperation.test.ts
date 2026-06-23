import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoggerOperation } from './LoggerOperation';
import { normalizeError } from '../utils/normalizeError';

vi.mock('../utils/normalizeError', () => ({
  normalizeError: vi.fn(),
}));

describe('LoggerOperation', () => {
  const logger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValue(1500);

    vi.mocked(normalizeError).mockReturnValue({
      message: 'normalized',
    });
  });

  it('logs operation start during creation', () => {
    new LoggerOperation(logger as never, 'weather.load', { city: 'Kyiv' });

    expect(logger.info).toHaveBeenCalledWith('weather.load.started', {
      city: 'Kyiv',
    });
  });

  it('logs completion event with duration', () => {
    const operation = new LoggerOperation(logger as never, 'weather.load');

    operation.success({
      source: 'cache',
    });

    expect(logger.info).toHaveBeenCalledWith('weather.load.completed', {
      source: 'cache',
      durationMs: 500,
    });
  });

  it('logs normalized error on failure', () => {
    const operation = new LoggerOperation(logger as never, 'weather.load');

    operation.fail(new Error('boom'));

    expect(logger.error).toHaveBeenCalledWith(
      'weather.load.failed',
      expect.objectContaining({
        durationMs: 500,
        error: {
          message: 'normalized',
        },
      }),
    );
  });

  it('logs warning message', () => {
    const operation = new LoggerOperation(logger as never, 'weather.load', {
      city: 'Kyiv',
    });

    operation.warn('cache missed');

    expect(logger.warn).toHaveBeenCalledWith('cache missed', {
      city: 'Kyiv',
    });
  });
});
