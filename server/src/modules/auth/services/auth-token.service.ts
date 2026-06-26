import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@shared/types';
import { IAccessJwtPayload, IRefreshJwtPayload, JwtPayload } from '@auth/interfaces';
import { AppLoggerService } from '@logger/services';
import { LogMethod } from '@logger/decorators';
import { authTokenConfig, IAuthTokenConfig } from '@auth/config';
import { SignOptions } from 'jsonwebtoken';

@Injectable()
export class AuthTokenService {
  private readonly logger: AppLoggerService;
  private readonly tokenConfig: IAuthTokenConfig;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService<IAppConfig>,
    loggerService: AppLoggerService,
  ) {
    this.tokenConfig = authTokenConfig(config);
    this.logger = loggerService.child(AuthTokenService.name);
  }

  @LogMethod()
  async createAccessToken(tokenPayload: IAccessJwtPayload): Promise<string> {
    return this.createToken(
      tokenPayload,
      this.tokenConfig.access.secret,
      this.tokenConfig.access.expiresIn,
    );
  }

  @LogMethod()
  async createRefreshToken(tokenPayload: IRefreshJwtPayload): Promise<string> {
    return this.createToken(
      tokenPayload,
      this.tokenConfig.refresh.secret,
      this.tokenConfig.refresh.expiresIn,
    );
  }

  @LogMethod()
  async verifyAccessToken(token: string): Promise<IAccessJwtPayload> {
    return this.verifyToken<IAccessJwtPayload>(
      token,
      this.tokenConfig.access.secret,
    );
  }

  @LogMethod()
  async verifyRefreshToken(token: string): Promise<IRefreshJwtPayload> {
    return this.verifyToken<IRefreshJwtPayload>(
      token,
      this.tokenConfig.refresh.secret,
    );
  }

  private async createToken(
    tokenPayload: JwtPayload,
    secret: string,
    expiresIn: SignOptions['expiresIn'],
  ): Promise<string> {
      return this.jwt.signAsync(tokenPayload, {
        secret,
        expiresIn,
      });
  }

  private async verifyToken<T extends JwtPayload>(
    token: string,
    secret: string,
  ): Promise<T> {
      return this.jwt.verifyAsync<T>(token, {
        secret,
      });
  }
}
