import { LoggerContextService } from './logger-context.service';

describe('LoggerContextService', () => {
  let service: LoggerContextService;

  beforeEach(() => {
    service =
      new LoggerContextService();
  });

  describe('get', () => {
    it('should return empty object when context does not exist', () => {
      expect(service.get()).toEqual(
        {},
      );
    });
  });

  describe('run', () => {
    it('should expose context inside callback', () => {
      service.run(
        {
          requestId: 'req-1',
          userId: 'user-1',
        },
        () => {
          expect(
            service.get(),
          ).toEqual({
            requestId: 'req-1',
            userId: 'user-1',
          });
        },
      );
    });

    it('should return callback result', () => {
      const result = service.run(
        {
          requestId: 'req-1',
        },
        () => 'success',
      );

      expect(result).toBe(
        'success',
      );
    });
  });

  describe('set', () => {
    it('should update existing context', () => {
      service.run(
        {
          requestId: 'req-1',
        },
        () => {
          service.set({
            userId: 'user-1',
          });

          expect(
            service.get(),
          ).toEqual({
            requestId: 'req-1',
            userId: 'user-1',
          });
        },
      );
    });

    it('should do nothing without context', () => {
      expect(() =>
        service.set({
          userId: 'user-1',
        }),
      ).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear context', () => {
      service.run(
        {
          requestId: 'req-1',
          userId: 'user-1',
        },
        () => {
          service.clear();

          expect(
            service.get(),
          ).toEqual({});
        },
      );
    });

    it('should do nothing when context does not exist', () => {
      expect(() =>
        service.clear(),
      ).not.toThrow();
    });
  });

});
