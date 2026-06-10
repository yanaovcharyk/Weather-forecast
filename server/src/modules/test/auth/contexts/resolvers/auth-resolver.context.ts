import { AuthResolver } from '@auth/resolvers/auth.resolver';
import { AuthService } from '@auth/services';
import { AppLoggerService } from '@logger/services';
import { AccessJwtGuard, RefreshJwtGuard } from '@auth/guards';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthCookieService } from '@auth/services';
import { createLoggerMock } from '../../../mocks/logger.mock';
import { createMockRequest } from '../../../mocks/request.mock';
import { createResponseMock } from '../../../mocks/response.mock';
import { IGQLContext } from '../../../../auth/interfaces';
import { createContext } from '../../../utils/create-context';
import { MockUser, RAW_TOKEN_FIXTURE } from '../../fixtures';

export function createAuthServiceMock() {
  return {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    rotateRefreshToken: jest.fn(),
  };
}

export type AuthResolverTestContext = {
  resolver: AuthResolver;
  authService: ReturnType<typeof createAuthServiceMock>;
  logger: ReturnType<typeof createLoggerMock>;
  req: ReturnType<typeof createMockRequest>;
  res: ReturnType<typeof createResponseMock>;
  gqlContext: IGQLContext;
};

export async function createAuthResolverContext(): Promise<AuthResolverTestContext> {
  const authService = createAuthServiceMock();
  const logger = createLoggerMock();

  const req = createMockRequest();
  const res = createResponseMock();

  const resolver = await createContext(AuthResolver, [
    {
      provide: AuthService,
      useValue: authService,
    },
    {
      provide: AppLoggerService,
      useValue: logger,
    },
    {
      provide: RefreshJwtGuard,
      useValue: {
        canActivate: jest.fn().mockResolvedValue(true),
      },
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
        getRefreshToken: jest.fn(),
        getAccessToken: jest.fn(),
      },
    },
  ]);

  return {
    resolver,
    authService,
    logger,
    req,
    res,
    gqlContext: {
      req,
      res,
      user: {
        id: MockUser.id,
      },
      jwtToken: RAW_TOKEN_FIXTURE,
    },
  };
}
