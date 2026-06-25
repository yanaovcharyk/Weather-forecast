import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthTokenService } from '@auth/services/auth-token.service';
import { AppLoggerService } from '@logger/services';
import {
  createConfigMock,
  createJwtMock,
  createLoggerMock,
} from '@test/mocks';
import { jwtConfigFixture } from '@auth/test/fixtures';
import { createContext } from '@test/utils/create-context';

export type AuthTokenTestContext = {
  service: AuthTokenService;
  jwt: ReturnType<typeof createJwtMock>;
  config: ReturnType<typeof createConfigMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createAuthTokenContext(): Promise<AuthTokenTestContext> {
  const jwt = createJwtMock();

  const config = createConfigMock();
  config.get.mockReturnValue(jwtConfigFixture);

  const logger = createLoggerMock();

  const service = await createContext(AuthTokenService, [
    {
      provide: JwtService,
      useValue: jwt,
    },
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
    jwt,
    config,
    logger,
  };
}
