import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { AppLoggerService, LoggerContextService } from '@logger/services';

import { createContext } from '@shared/test/utils/create-context';

export function createWinstonLoggerMock() {
  const childLogger = {
    log: jest.fn(),
  };

  return {
    log: jest.fn(),
    child: jest.fn().mockReturnValue(childLogger),
  };
}

export function createLoggerContextServiceMock() {
  return {
    get: jest.fn(),
    set: jest.fn(),
  };
}

export type AppLoggerServiceTestContext = {
  service: AppLoggerService;
  logger: ReturnType<typeof createWinstonLoggerMock>;
  contextService: ReturnType<typeof createLoggerContextServiceMock>;
};

export async function createAppLoggerServiceContext(): Promise<AppLoggerServiceTestContext> {
  const logger = createWinstonLoggerMock();

  const contextService = createLoggerContextServiceMock();

  const service = await createContext(AppLoggerService, [
    {
      provide: WINSTON_MODULE_PROVIDER,
      useValue: logger,
    },
    {
      provide: LoggerContextService,
      useValue: contextService,
    },
  ]);

  return {
    service,
    logger,
    contextService,
  };
}
