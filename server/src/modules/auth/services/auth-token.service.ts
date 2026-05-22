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
    const jwtConfig = this.config.get('jwt', { infer: true })!;

    this.accessSecret = jwtConfig.accessSecret;
    this.refreshSecret = jwtConfig.refreshSecret;
    this.accessExpires = jwtConfig.accessExpires;
    this.refreshExpires = jwtConfig.refreshExpires;

    this.logger = loggerService.child(AuthTokenService.name);

    this.logger.info('AuthTokenService initialized', {
      accessExpires: this.accessExpires,
      refreshExpires: this.refreshExpires,
    });
  }

  async createAccessToken(tokenPayload: IAccessJwtPayload): Promise<string> {
    this.logger.debug('Creating access token', {
      userId: tokenPayload.userId,
      email: tokenPayload.email,
    });

    return this.createToken(
      tokenPayload,
      this.accessSecret,
      this.accessExpires,
    );
  }

  async createRefreshToken(tokenPayload: IRefreshJwtPayload): Promise<string> {
    this.logger.debug('Creating refresh token', {
      userId: tokenPayload.userId,
      version: tokenPayload.version,
    });

    return this.createToken(
      tokenPayload,
      this.refreshSecret,
      this.refreshExpires,
    );
  }

  async verifyAccessToken(token: string): Promise<IAccessJwtPayload> {
    this.logger.debug('Verifying access token');

    return this.verifyToken<IAccessJwtPayload>(
      token,
      this.accessSecret,
      'Unauthorized',
    );
  }

  async verifyRefreshToken(token: string): Promise<IRefreshJwtPayload> {
    this.logger.debug('Verifying refresh token');

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
      const token = await this.jwt.signAsync<T>(tokenPayload, {
        secret,
        expiresIn: expiresIn as any,
      });

      this.logger.debug('JWT token created successfully');

      return token;
    } catch (error: unknown) {
      this.logger.error(
        'Failed to create JWT token',
        error instanceof Error ? error : undefined,
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
      const payload = await this.jwt.verifyAsync<T>(token, { secret });

      this.logger.debug('JWT token verified successfully');

      return payload;
    } catch (error) {
      this.logger.warn('JWT verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throwUnauthorized(errorMessage);
    }
  }
}
