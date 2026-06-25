import { ClientLoggerService } from '@logger/services';
import { AppLoggerService } from '@logger/services';
import { createContext } from '@shared/test/utils/create-context';

export function createAppLoggerServiceMock() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
}

export type ClientLoggerServiceTestContext = {
  service: ClientLoggerService;
  logger: ReturnType<typeof createAppLoggerServiceMock>;
};

export async function createClientLoggerServiceContext(): Promise<ClientLoggerServiceTestContext> {
  const logger = createAppLoggerServiceMock();

  const service = await createContext(ClientLoggerService, [
    {
      provide: AppLoggerService,
      useValue: logger,
    },
  ]);

  return {
    service,
    logger,
  };
}
