import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

import { BaseJwtGuard } from '@auth/guards/base-jwt.guard';
import { AuthCookieService } from '@auth/services';
import { AUTH_GRAPHQL_ERRORS } from '@auth/constants';
import { JwtPayload } from '@auth/interfaces';

import { createJwtServiceMock } from '../../test/auth/mocks/jwt-service.mock';
import { createConfigMock } from '../../test/mocks/config.mock';
import { createAuthCookieServiceMock } from '../../test/auth/mocks/auth-cookie-service.mock';

class TestJwtGuard extends BaseJwtGuard {
  public readonly getTokenMock = jest.fn();
  public readonly getSecretMock = jest.fn();
  public readonly validatePayloadMock = jest.fn();

  protected getToken(req: Request): string | null {
    return this.getTokenMock(req);
  }

  protected getSecret(): string {
    return this.getSecretMock();
  }

  protected validatePayload(
    payload: JwtPayload,
    token: string,
  ): void {
    this.validatePayloadMock(payload, token);
  }
}

describe('BaseJwtGuard', () => {
  let moduleRef: TestingModule;
  let guard: TestJwtGuard;

  let jwtService: ReturnType<typeof createJwtServiceMock>;
  let configService: ReturnType<typeof createConfigMock>;
  let cookieService: ReturnType<
    typeof createAuthCookieServiceMock
  >;

  let gqlContext: {
    req: Record<string, unknown>;
    jwtPayload?: unknown;
    jwtToken?: string;
  };

  beforeEach(async () => {
    jwtService = createJwtServiceMock();
    configService = createConfigMock();
    cookieService = createAuthCookieServiceMock();

    gqlContext = {
      req: {},
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue({
        getContext: () => gqlContext,
      } as never);

    moduleRef = await Test.createTestingModule({
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

    guard = moduleRef.get(TestJwtGuard);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await moduleRef.close();
  });

  it('should throw unauthorized when token is missing', async () => {
    guard.getTokenMock.mockReturnValue(null);

    await expect(
      guard.canActivate({} as ExecutionContext),
    ).rejects.toBe(AUTH_GRAPHQL_ERRORS.UNAUTHORIZED);

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should verify token using secret', async () => {
    guard.getTokenMock.mockReturnValue('token');
    guard.getSecretMock.mockReturnValue('secret');

    jwtService.verifyAsync.mockResolvedValue({
      sub: '1',
    });

    await guard.canActivate({} as ExecutionContext);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith(
      'token',
      {
        secret: 'secret',
      },
    );
  });

  it('should call validatePayload', async () => {
    const payload = {
      sub: '1',
    };

    guard.getTokenMock.mockReturnValue('token');
    guard.getSecretMock.mockReturnValue('secret');

    jwtService.verifyAsync.mockResolvedValue(payload);

    await guard.canActivate({} as ExecutionContext);

    expect(
      guard.validatePayloadMock,
    ).toHaveBeenCalledWith(payload, 'token');
  });

  it('should attach payload and token to gql context', async () => {
    const payload = {
      sub: '1',
    };

    guard.getTokenMock.mockReturnValue('token');
    guard.getSecretMock.mockReturnValue('secret');

    jwtService.verifyAsync.mockResolvedValue(payload);

    await guard.canActivate({} as ExecutionContext);

    expect(gqlContext.jwtPayload).toEqual(payload);
    expect(gqlContext.jwtToken).toBe('token');
  });

  it('should return true for valid token', async () => {
    guard.getTokenMock.mockReturnValue('token');
    guard.getSecretMock.mockReturnValue('secret');

    jwtService.verifyAsync.mockResolvedValue({
      sub: '1',
    });

    await expect(
      guard.canActivate({} as ExecutionContext),
    ).resolves.toBe(true);
  });

  it('should throw unauthorized when jwt verification fails', async () => {
    guard.getTokenMock.mockReturnValue('token');
    guard.getSecretMock.mockReturnValue('secret');

    jwtService.verifyAsync.mockRejectedValue(
      new Error('jwt error'),
    );

    await expect(
      guard.canActivate({} as ExecutionContext),
    ).rejects.toBe(AUTH_GRAPHQL_ERRORS.UNAUTHORIZED);
  });

  it('should throw unauthorized when payload validation fails', async () => {
    guard.getTokenMock.mockReturnValue('token');
    guard.getSecretMock.mockReturnValue('secret');

    jwtService.verifyAsync.mockResolvedValue({
      sub: '1',
    });

    guard.validatePayloadMock.mockImplementation(() => {
      throw new Error('invalid payload');
    });

    await expect(
      guard.canActivate({} as ExecutionContext),
    ).rejects.toBe(AUTH_GRAPHQL_ERRORS.UNAUTHORIZED);
  });
});