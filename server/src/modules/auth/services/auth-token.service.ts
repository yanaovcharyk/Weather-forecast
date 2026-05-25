import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { IAppConfig } from '../../../shared/types/app.config';

import { throwUnauthorized } from '../../../shared/errors/unautorized.error';

import {
  IAccessJwtPayload,
  IRefreshJwtPayload,
} from '../interfaces/jwt-payload.interfaces';

import { AppLoggerService } from '../../logger/services/app-logger.service';

import { LogMethod } from '@shared/logging/log-method.decorator';

@Injectable()
export class AuthTokenService {
  private readonly logger;

  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpires: string;
  private readonly refreshExpires: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService<IAppConfig>,
    loggerService: AppLoggerService,
  ) {
    const jwtConfig =
      this.config.get('jwt', {
        infer: true,
      })!;

    this.accessSecret = jwtConfig.accessSecret;
    this.refreshSecret = jwtConfig.refreshSecret;

    this.accessExpires =
      jwtConfig.accessExpires;

    this.refreshExpires =
      jwtConfig.refreshExpires;

    this.logger =
      loggerService.child(AuthTokenService.name);

    this.logger.info(
      'AuthTokenService initialized',
      {
        accessExpires: this.accessExpires,
        refreshExpires: this.refreshExpires,
      },
    );
  }

  @LogMethod({
    logArgs: false,
    logResult: false,
  })
  async createAccessToken(
    tokenPayload: IAccessJwtPayload,
  ): Promise<string> {
    return this.createToken(
      tokenPayload,
      this.accessSecret,
      this.accessExpires,
    );
  }

  @LogMethod({
    logArgs: false,
    logResult: false,
  })
  async createRefreshToken(
    tokenPayload: IRefreshJwtPayload,
  ): Promise<string> {
    return this.createToken(
      tokenPayload,
      this.refreshSecret,
      this.refreshExpires,
    );
  }

  @LogMethod({
    logArgs: false,
    logResult: false,
  })
  async verifyAccessToken(
    token: string,
  ): Promise<IAccessJwtPayload> {
    return this.verifyToken<IAccessJwtPayload>(
      token,
      this.accessSecret,
      'Unauthorized',
    );
  }

  @LogMethod({
    logArgs: false,
    logResult: false,
  })
  async verifyRefreshToken(
    token: string,
  ): Promise<IRefreshJwtPayload> {
    return this.verifyToken<IRefreshJwtPayload>(
      token,
      this.refreshSecret,
      'Invalid refresh token',
    );
  }

  private async createToken<T extends object>(
    tokenPayload: T,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    try {
      return await this.jwt.signAsync<T>(
        tokenPayload,
        {
          secret,
          expiresIn: expiresIn as any,
        },
      );
    } catch (error: unknown) {
      this.logger.error(
        'Failed to create JWT token',
        error instanceof Error
          ? error
          : undefined,
        {
          stage: 'signAsync',
        },
      );

      throw error;
    }
  }

  private async verifyToken<T extends object>(
    token: string,
    secret: string,
    errorMessage: string,
  ): Promise<T> {
    try {
      return await this.jwt.verifyAsync<T>(
        token,
        {
          secret,
        },
      );
    } catch (error) {
      this.logger.warn(
        'JWT verification failed',
        {
          error:
            error instanceof Error
              ? error.message
              : 'Unknown error',
        },
      );

      throwUnauthorized(errorMessage);
    }
  }
}
