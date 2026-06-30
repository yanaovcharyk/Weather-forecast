import { ConfigService } from '@nestjs/config';
import { AuthCookieService } from '@auth/services/auth-cookie.service';
import { AppLoggerService } from '@logger/services';
import {
  createConfigMock,
  createLoggerMock,
  createMockRequest,
  createResponseMock,
} from '@test/mocks';
import { createContext } from '@test/utils/create-context';

export type AuthCookieTestContext = {
  service: AuthCookieService;
  config: ReturnType<typeof createConfigMock>;
  logger: ReturnType<typeof createLoggerMock>;
  req: ReturnType<typeof createMockRequest>;
  res: ReturnType<typeof createResponseMock>;
};

export async function createAuthCookieContext(): Promise<AuthCookieTestContext> {
  const config = createConfigMock();
  config.getOrThrow.mockImplementation((key: string) => {
    if (key === 'auth.cookie') {
      return {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      };
    }

    return '15m';
  });

  const logger = createLoggerMock();

  const service = await createContext(AuthCookieService, [
    {
      provide: ConfigService,
      useValue: config,
    },
    {
      provide: AppLoggerService,
      useValue: logger,
    },
  ]);

  return {
    service,
    config,
    logger,
    req: createMockRequest(),
    res: createResponseMock(),
  };
}
