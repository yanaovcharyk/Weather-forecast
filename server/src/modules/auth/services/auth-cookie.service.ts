import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { IAppConfig } from '@shared/types/app.config';
import { AppLoggerService } from '@logger/services/app-logger.service';
import { MsString, TokenName } from '../types';
import { LogMethod } from '@shared/logging/decorators/log-method.decorator';

@Injectable()
export class AuthCookieService {
  private readonly logger;
  constructor(
    private readonly config: ConfigService<IAppConfig>,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(AuthCookieService.name);
  }

  private get cookieOptions() {
    const isProd =
      this.config.get('nodeEnv', {
        infer: true,
      }) === 'production';

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      path: '/',
    };
  }

  getAccessToken(req: Request): string | null {
    return req.cookies?.accessToken ?? null;
  }

  getRefreshToken(req: Request): string | null {
    return req.cookies?.refreshToken ?? null;
  }

  @LogMethod()
  clearAuthCookies(res: Response): void {
    res.clearCookie(TokenName.ACCESS, this.cookieOptions);
    res.clearCookie(TokenName.REFRESH, this.cookieOptions);
  }

  private getAccessTokenMaxAge(): number {
    const expires = this.config.get('jwt.accessExpires', {
      infer: true,
    });

    if (!expires) {
      this.logger.error(
        'jwt.accessExpires is not defined',
        new Error('Missing config'),
      );

      throw new Error('jwt.accessExpires is not defined');
    }

    return this.parseMs(expires);
  }

  private getRefreshTokenMaxAge(): number {
    const expires = this.config.get('jwt.refreshExpires', {
      infer: true,
    });

    if (!expires) {
      this.logger.error(
        'jwt.refreshExpires is not defined',
        new Error('Missing config'),
      );

      throw new Error('jwt.refreshExpires is not defined');
    }

    return this.parseMs(expires);
  }

  private parseMs(value: MsString): number {
    const result = ms(value);

    if (typeof result !== 'number') {
      this.logger.error(
        `Invalid ms value: ${value}`,
        new Error('Invalid ms format'),
      );

      throw new Error(`Invalid ms value: ${value}`);
    }

    return result;
  }

  private setToken(
    res: Response,
    token: string,
    name: TokenName,
    maxAge: number,
  ): void {
    res.cookie(name, token, {
      ...this.cookieOptions,
      maxAge,
    });
  }

  @LogMethod()
  setAccessToken(res: Response, token: string): void {
    this.setToken(res, token, TokenName.ACCESS, this.getAccessTokenMaxAge());
  }

  @LogMethod()
  setRefreshToken(res: Response, token: string): void {
    this.setToken(res, token, TokenName.REFRESH, this.getRefreshTokenMaxAge());
  }

  @LogMethod()
  clearAccessToken(res: Response): void {
    res.clearCookie(TokenName.ACCESS, this.cookieOptions);
  }

  @LogMethod()
  clearRefreshToken(res: Response): void {
    res.clearCookie(TokenName.REFRESH, this.cookieOptions);
  }
}
