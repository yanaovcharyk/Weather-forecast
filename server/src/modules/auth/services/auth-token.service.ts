import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '../../../shared/types/app.config';
import { throwUnauthorized } from '../../../shared/errors/unautorized.error';
import {
  IAccessJwtPayload,
  IRefreshJwtPayload,
} from '../interfaces/jwt-payload.interfaces';

@Injectable()
export class AuthTokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpires: string;
  private readonly refreshExpires: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService<IAppConfig>,
  ) {
    const jwtConfig = this.config.get('jwt', { infer: true })!;
    this.accessSecret = jwtConfig.accessSecret;
    this.refreshSecret = jwtConfig.refreshSecret;
    this.accessExpires = jwtConfig.accessExpires;
    this.refreshExpires = jwtConfig.refreshExpires;
  }

  async createAccessToken(tokenPayload: IAccessJwtPayload): Promise<string> {
    return this.createToken(
      tokenPayload,
      this.accessSecret,
      this.accessExpires,
    );
  }

  async createRefreshToken(tokenPayload: IRefreshJwtPayload): Promise<string> {
    return this.createToken(
      tokenPayload,
      this.refreshSecret,
      this.refreshExpires,
    );
  }

  async verifyAccessToken(token: string): Promise<IAccessJwtPayload> {
    return this.verifyToken<IAccessJwtPayload>(
      token,
      this.accessSecret,
      'Unauthorized',
    );
  }

  async verifyRefreshToken(token: string): Promise<IRefreshJwtPayload> {
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
    return this.jwt.signAsync<T>(tokenPayload, {
      secret,
      expiresIn: expiresIn as any,
    });
  }

  private async verifyToken<T extends object>(
    token: string,
    secret: string,
    errorMessage: string,
  ): Promise<T> {
    try {
      return await this.jwt.verifyAsync<T>(token, { secret });
    } catch {
      throwUnauthorized(errorMessage);
    }
  }
}
