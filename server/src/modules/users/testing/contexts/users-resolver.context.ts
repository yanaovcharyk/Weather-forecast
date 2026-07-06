import { UsersResolver } from '@users/resolvers';
import { AccessJwtGuard } from '@auth/guards';
import { AuthCookieService } from '@auth/services';
import { UserService } from '@users/services';
import { AppLoggerService } from '@logger/services';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createLoggerMock } from '@shared/testing/mocks/logger.mock';
import { createContext } from '@shared/testing/utils/create-context';
import { createUserServiceMock } from '@shared/testing/mocks';

export type UsersResolverTestContext = {
  resolver: UsersResolver;
  userService: ReturnType<typeof createUserServiceMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createUsersResolverContext(): Promise<UsersResolverTestContext> {
  const userService = createUserServiceMock();
  const logger = createLoggerMock();

  const resolver = await createContext(UsersResolver, [
    {
      provide: UserService,
      useValue: userService,
    },
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
    userService,
    logger,
  };
}
