import {
  createClientLoggerServiceContext,
  ClientLoggerServiceTestContext,
} from '@logger/test/contexts/client-logger-service.context';

import {
  ClientInfoLog,
  ClientWarnLog,
  ClientErrorLog,
  ClientDebugLog,
} from '@logger/test/fixtures/client-log.fixture';

describe('ClientLoggerService', () => {
  let ctx: ClientLoggerServiceTestContext;

  beforeEach(async () => {
    ctx = await createClientLoggerServiceContext();
  });

  describe('writeLogs', () => {
    it('should write info log', () => {
      ctx.service.writeLogs([ClientInfoLog]);

      expect(ctx.logger.info).toHaveBeenCalled();
    });

    it('should write warn log', () => {
      ctx.service.writeLogs([ClientWarnLog]);

      expect(ctx.logger.warn).toHaveBeenCalled();
    });

    it('should write error log', () => {
      ctx.service.writeLogs([ClientErrorLog]);

      expect(ctx.logger.error).toHaveBeenCalled();
    });

    it('should write debug log', () => {
      ctx.service.writeLogs([ClientDebugLog]);

      expect(ctx.logger.debug).toHaveBeenCalled();
    });

    it('should parse metadata json', () => {
      ctx.service.writeLogs([
        {
          ...ClientInfoLog,
          metadata: '{"city":"Kyiv"}',
        },
      ]);

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'info message',
        expect.objectContaining({
          city: 'Kyiv',
        }),
      );
    });

    it('should handle invalid json', () => {
      ctx.service.writeLogs([
        {
          ...ClientInfoLog,
          metadata: '{broken',
        },
      ]);

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'info message',
        expect.objectContaining({
          invalidMeta: 'Failed to parse meta JSON',
        }),
      );
    });

    it('should handle null metadata', () => {
      ctx.service.writeLogs([
        {
          ...ClientInfoLog,
          metadata: undefined,
        },
      ]);

      expect(ctx.logger.info).toHaveBeenCalled();
    });

    it('should handle array metadata', () => {
      ctx.service.writeLogs([
        {
          ...ClientInfoLog,
          metadata: '[]',
        },
      ]);

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'info message',
        expect.objectContaining({
          invalidMeta: 'Meta is not an object',
        }),
      );
    });

    it('should handle primitive metadata', () => {
      ctx.service.writeLogs([
        {
          ...ClientInfoLog,
          metadata: '"hello"',
        },
      ]);

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'info message',
        expect.objectContaining({
          invalidMeta: 'Meta is not an object',
        }),
      );
    });

    it('should handle null json metadata', () => {
      ctx.service.writeLogs([
        {
          ...ClientInfoLog,
          metadata: 'null',
        },
      ]);

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'info message',
        expect.objectContaining({
          invalidMeta: 'Meta is not an object',
        }),
      );
    });
  });
});
