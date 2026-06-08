import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthCookieService } from '@auth/services/auth-cookie.service';
import { AppLoggerService } from '@logger/services';

import { createLoggerMock } from '../mocks/logger.mock';
import { createMockRequest } from '../mocks/request.mock';
import { createResponseMock } from '../mocks/response.mock';
import { createConfigMock } from '../mocks/config.mock';
import { createContext } from '../utils/create-context';

export type AuthCookieTestContext = {
  service: AuthCookieService;

  config: ReturnType<typeof createConfigMock>

  logger: ReturnType<typeof createLoggerMock>;

  req: ReturnType<typeof createMockRequest>;
  res: ReturnType<typeof createResponseMock>;
};

export async function createAuthCookieContext(): Promise<AuthCookieTestContext> {
  const config = createConfigMock();
  config.getOrThrow.mockReturnValue('15m');

  const logger = createLoggerMock();

  const service = await createContext(
    AuthCookieService,
    [
      {
        provide: ConfigService,
        useValue: config,
      },
      {
        provide: AppLoggerService,
        useValue: logger,
      },
    ],
  );

  return {
    service,
    config,
    logger,
    req: createMockRequest(),
    res: createResponseMock(),
  };
}
