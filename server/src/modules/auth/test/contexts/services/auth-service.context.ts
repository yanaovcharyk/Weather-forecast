import { AuthService } from '@auth/services/auth.service';
import { UserService } from '@users/services';
import { AuthTokenService } from '@auth/services/auth-token.service';
import { AuthCookieService } from '@auth/services/auth-cookie.service';
import { Pbkdf2PasswordHasher } from '@auth/services/password-hasher.service';
import { AppLoggerService } from '@logger/services';
import {
  createLoggerMock,
  createMockRequest,
  createResponseMock,
  createUserServiceMock,
} from '@test/mocks';
import {
  createAuthCookieServiceMock,
  createAuthTokenServiceMock,
  createPasswordHasherMock,
} from '@auth/test/mocks';
import { createContext } from '@test/utils/create-context';

export type AuthTestContext = {
  service: AuthService;

  usersService: ReturnType<typeof createUserServiceMock>;
  tokenService: ReturnType<typeof createAuthTokenServiceMock>;
  cookieService: ReturnType<typeof createAuthCookieServiceMock>;
  passwordHasher: ReturnType<typeof createPasswordHasherMock>;

  logger: ReturnType<typeof createLoggerMock>;

  req: ReturnType<typeof createMockRequest>;
  res: ReturnType<typeof createResponseMock>;
};

export async function createAuthContext(): Promise<AuthTestContext> {
  const usersService = createUserServiceMock();
  const tokenService = createAuthTokenServiceMock();
  const cookieService = createAuthCookieServiceMock();
  const passwordHasher = createPasswordHasherMock();
  const logger = createLoggerMock();

  const service = await createContext(AuthService, [
    {
      provide: UserService,
      useValue: usersService,
    },
    {
      provide: AuthTokenService,
      useValue: tokenService,
    },
    {
      provide: AuthCookieService,
      useValue: cookieService,
    },
    {
      provide: Pbkdf2PasswordHasher,
      useValue: passwordHasher,
    },
    {
      provide: AppLoggerService,
      useValue: logger,
    },
  ]);

  return {
    service,

    usersService,
    tokenService,
    cookieService,
    passwordHasher,

    logger,

    req: createMockRequest(),
    res: createResponseMock(),
  };
}
