import {
  AppLoggerServiceTestContext,
  createAppLoggerServiceContext,
} from '@test/logger/contexts/app-logger-service.context';
import { AppLoggerService } from './app-logger.service';

describe('AppLoggerService', () => {
  let service: AppLoggerService;
  let ctx: AppLoggerServiceTestContext;

  beforeEach(async () => {
    ctx = await createAppLoggerServiceContext();
    service = ctx.service;
  });

  describe('child', () => {
    it('should create child logger with context', () => {
      const child = service.child(
        'CitiesService',
      );

      expect(
        ctx.logger.child,
      ).toHaveBeenCalledWith({
        context: 'CitiesService',
      });

      expect(child).toBeInstanceOf(
        AppLoggerService,
      );
    });
  });

  describe('info', () => {
    it('should write info log', () => {
      ctx.contextService.get.mockReturnValue({
        requestId: 'req-1',
      });

      service.info('message');

      expect(
        ctx.logger.log,
      ).toHaveBeenCalledWith(
        'info',
        'message',
        {
          requestId: 'req-1',
        },
      );
    });

    it('should merge metadata', () => {
      ctx.contextService.get.mockReturnValue({
        requestId: 'req-1',
      });

      service.info('message', {
        city: 'Kyiv',
      });

      expect(
        ctx.logger.log,
      ).toHaveBeenCalledWith(
        'info',
        'message',
        {
          requestId: 'req-1',
          city: 'Kyiv',
        },
      );
    });
  });

  describe('debug', () => {
    it('should write debug log', () => {
      ctx.contextService.get.mockReturnValue(
        {},
      );

      service.debug('debug');

      expect(
        ctx.logger.log,
      ).toHaveBeenCalledWith(
        'debug',
        'debug',
        {},
      );
    });
  });

  describe('warn', () => {
    it('should write warn log', () => {
      ctx.contextService.get.mockReturnValue(
        {},
      );

      service.warn('warn');

      expect(
        ctx.logger.log,
      ).toHaveBeenCalledWith(
        'warn',
        'warn',
        {},
      );
    });
  });

  describe('error', () => {
    it('should write error log with error details', () => {
      const error = new Error('boom');

      ctx.contextService.get.mockReturnValue({
        requestId: 'req-1',
      });

      service.error(
        'failed',
        error,
        {
          city: 'Kyiv',
        },
      );

      expect(
        ctx.logger.log,
      ).toHaveBeenCalledWith(
        'error',
        'failed',
        expect.objectContaining({
          requestId: 'req-1',
          city: 'Kyiv',
          error: 'boom',
          stack: error.stack,
        }),
      );
    });

    it('should write error log without error object', () => {
      ctx.contextService.get.mockReturnValue(
        {},
      );

      service.error('failed');

      expect(
        ctx.logger.log,
      ).toHaveBeenCalledWith(
        'error',
        'failed',
        {
          error: undefined,
          stack: undefined,
        },
      );
    });
  });

  describe('setContext', () => {
    it('should delegate context update', () => {
      service.setContext({
        userId: 'u1',
      });

      expect(
        ctx.contextService.set,
      ).toHaveBeenCalledWith({
        userId: 'u1',
      });
    });
  });
});
