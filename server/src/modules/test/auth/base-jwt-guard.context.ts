import { GqlExecutionContext } from '@nestjs/graphql';
import { createJwtServiceMock } from './mocks/jwt-service.mock';
import { createConfigMock } from '../mocks/config.mock';
import { createAuthCookieServiceMock } from './mocks/auth-cookie-service.mock';
import { AuthCookieService } from '../../auth/services';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BaseJwtGuard } from '../../auth/guards';
import { Test } from '@nestjs/testing';
import { TestJwtGuard } from './test-jwt.guard';

export type BaseJwtGuardContext = {
  guard: TestJwtGuard;

  jwtService: ReturnType<typeof createJwtServiceMock>;
  configService: ReturnType<typeof createConfigMock>;
  cookieService: ReturnType<typeof createAuthCookieServiceMock>;

  gqlContext: {
    req: Record<string, unknown>;
    jwtPayload?: unknown;
    jwtToken?: string;
  };
};

export async function createBaseJwtGuardContext(): Promise<BaseJwtGuardContext> {
  const jwtService = createJwtServiceMock();
  const configService = createConfigMock();
  const cookieService = createAuthCookieServiceMock();

  const gqlContext = {
    req: {},
  };

  jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
    getContext: () => gqlContext,
  } as never);

  const moduleRef = await Test.createTestingModule({
    providers: [
      TestJwtGuard,
      {
        provide: JwtService,
        useValue: jwtService,
      },
      {
        provide: ConfigService,
        useValue: configService,
      },
      {
        provide: AuthCookieService,
        useValue: cookieService,
      },
    ],
  }).compile();

  return {
    guard: moduleRef.get(TestJwtGuard),
    jwtService,
    configService,
    cookieService,
    gqlContext,
  };
}
