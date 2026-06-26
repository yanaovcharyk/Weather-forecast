import {
  createClientLogsResolverContext,
  ClientLogsResolverTestContext,
} from '@logger/testing/contexts/client-logs-resolver.context';

import { ClientInfoLog } from '@logger/testing/fixtures/client-log.fixture';
import { ClientLogInput } from '@logger/dto';

describe('ClientLogsResolver', () => {
  let ctx: ClientLogsResolverTestContext;

  beforeEach(async () => {
    ctx = await createClientLogsResolverContext();
  });

  describe('sendClientLogs', () => {
    it('should write logs and return true', async () => {
      const result = await ctx.resolver.sendClientLogs([ClientInfoLog]);

      expect(ctx.clientLoggerService.writeLogs).toHaveBeenCalledWith([
        ClientInfoLog,
      ]);

      expect(result).toBe(true);
    });

    it('should handle empty input array', async () => {
      const result = await ctx.resolver.sendClientLogs([]);
      expect(ctx.clientLoggerService.writeLogs).toHaveBeenCalledWith([]);
      expect(result).toBe(true);
    });

    it('should write multiple logs', async () => {
      const logs: ClientLogInput[] = [
        {
          message: 'First log',
          timestamp: new Date().toISOString(),
          level: 'info',
        },
        {
          message: 'Second log',
          timestamp: new Date().toISOString(),
          level: 'error',
        },
      ];
      const result = await ctx.resolver.sendClientLogs(logs);
      expect(ctx.clientLoggerService.writeLogs).toHaveBeenCalledWith(logs);
      expect(result).toBe(true);
    });
  });
});
