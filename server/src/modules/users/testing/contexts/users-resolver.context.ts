import { UsersResolver } from '@users/resolvers';
import { AccessJwtGuard } from '@auth/guards';
import { AuthCookieService } from '@auth/services';
import { AppLoggerService } from '@logger/services';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createLoggerMock } from '@shared/testing/mocks/logger.mock';
import { createContext } from '@shared/testing/utils/create-context';

export type UsersResolverTestContext = {
  resolver: UsersResolver;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createUsersResolverContext(): Promise<UsersResolverTestContext> {
  const logger = createLoggerMock();

  const resolver = await createContext(UsersResolver, [
    {
      provide: AppLoggerService,
      useValue: logger,
    },
    {
      provide: AccessJwtGuard,
      useValue: {
        canActivate: jest.fn().mockResolvedValue(true),
      },
    },
    {
      provide: JwtService,
      useValue: {
        verifyAsync: jest.fn(),
      },
    },
    {
      provide: ConfigService,
      useValue: {
        get: jest.fn(),
      },
    },
    {
      provide: AuthCookieService,
      useValue: {
        getAccessToken: jest.fn(),
        getRefreshToken: jest.fn(),
      },
    },
  ]);

  return {
    resolver,
    logger,
  };
}
