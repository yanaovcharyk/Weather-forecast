import { describe, it, expect, vi, type Mock } from 'vitest';
import { createLogger } from './createLogger';
import { logger } from '@/logger/services/LoggerService';

vi.mock('@/logger/services/LoggerService', () => ({
  logger: {
    child: vi.fn(),
  },
}));

describe('createLogger', () => {
  it('creates child logger with moduleName', () => {
    (logger.child as Mock).mockReturnValue('child-logger');

    const result = createLogger('auth');

    expect(logger.child).toHaveBeenCalledWith({
      moduleName: 'auth',
    });

    expect(result).toBe('child-logger');
  });
});
