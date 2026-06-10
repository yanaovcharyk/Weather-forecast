import { GqlExecutionContext } from '@nestjs/graphql';

import { AccessJwtGuard } from '@auth/guards/access-jwt.guard';
import { createJwtServiceMock } from './mocks/jwt-service.mock';
import { createConfigMock } from '../mocks/config.mock';
import { createAuthCookieServiceMock } from './mocks/auth-cookie-service.mock';


export type AccessJwtGuardContext = {
  guard: AccessJwtGuard;

  jwtService: ReturnType<typeof createJwtServiceMock>;
  configService: ReturnType<typeof createConfigMock>;
  cookieService: ReturnType<typeof createAuthCookieServiceMock>;

  gqlContext: {
    req: Record<string, unknown>;
    jwtPayload?: unknown;
    jwtToken?: string;
  };
};

export function createAccessJwtGuardContext(): AccessJwtGuardContext {
  const jwtService = createJwtServiceMock();
  const configService = createConfigMock();
  const cookieService = createAuthCookieServiceMock();

  const guard = new AccessJwtGuard(
    jwtService as any,
    configService as any,
    cookieService as any,
  );

  const gqlContext = {
    req: {},
  };

  jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
    getContext: () => gqlContext,
  } as any);

  return {
    guard,
    jwtService,
    configService,
    cookieService,
    gqlContext,
  };
}
