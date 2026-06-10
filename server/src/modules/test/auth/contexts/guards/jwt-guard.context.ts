import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  createJwtServiceMock,
  createAuthCookieServiceMock,
} from '@test/auth/mocks';
import { createGqlContext, MockGqlContext } from '@test/auth/contexts/gql-context';
import { createConfigMock } from '@test/mocks';
import { createContext } from '@test/utils/create-context';
import { AuthCookieService } from '@auth/services';
import { mockGqlExecutionContext } from '../gql-execution-context';

export type GuardContext<TGuard> = {
  guard: TGuard;
  jwtService: ReturnType<typeof createJwtServiceMock>;
  configService: ReturnType<typeof createConfigMock>;
  cookieService: ReturnType<typeof createAuthCookieServiceMock>;
  gqlContext: MockGqlContext;
  gqlSpy: jest.SpyInstance;
};

export async function createGuardContext<TGuard>(
  GuardClass: new (...args: any[]) => TGuard,
): Promise<GuardContext<TGuard>> {
  const jwtService = createJwtServiceMock();
  const configService = createConfigMock();
  const cookieService = createAuthCookieServiceMock();
  const gqlContext = createGqlContext();
  const gqlSpy = mockGqlExecutionContext(gqlContext);

  const guard = await createContext(GuardClass, [
    { provide: JwtService, useValue: jwtService },
    { provide: ConfigService, useValue: configService },
    { provide: AuthCookieService, useValue: cookieService },
  ]);

  return {
    guard,
    jwtService,
    configService,
    cookieService,
    gqlContext,
    gqlSpy,
  };
}

