import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

import { IAppConfig } from '../../../shared/types/app.config';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { LoggerContextService } from '../../logger/services/logger-context.service';

enum TokenName {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

type MsString = `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`;

@Injectable()
export class AuthCookieService {
  private readonly logger;

  constructor(
    private readonly config: ConfigService<IAppConfig>,
    private contextService: LoggerContextService,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(AuthCookieService.name);
  }

  private get cookieOptions() {
    const isProd = this.config.get('nodeEnv', { infer: true }) === 'production';

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      path: '/',
    };
  }

  getAccessToken(req: Request): string | null {
    const token = req.cookies?.accessToken ?? null;

    this.logger.debug('Access token extracted from cookies', {
      hasToken: Boolean(token),
      ip: req.ip,
    });

    return token;
  }

  getRefreshToken(req: Request): string | null {
    const token = req.cookies?.refreshToken ?? null;

    this.logger.debug('Refresh token extracted from cookies', {
      hasToken: Boolean(token),
      ip: req.ip,
    });

    return token;
  }

  clearAuthCookies(res: Response) {
    this.logger.info('Clearing auth cookies');

    res.clearCookie(TokenName.ACCESS, this.cookieOptions);
    res.clearCookie(TokenName.REFRESH, this.cookieOptions);
  }

  private getAccessTokenMaxAge(): number {
    const expires = this.config.get('jwt.accessExpires', { infer: true });

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
    const expires = this.config.get('jwt.refreshExpires', { infer: true });

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
  ) {
    this.logger.debug('Setting auth cookie', {
      tokenType: name,
      maxAge,
    });

    res.cookie(name, token, {
      ...this.cookieOptions,
      maxAge,
    });

    this.contextService.printContext('COOKIE SERVICE');
  }

  setAccessToken(res: Response, token: string) {
    this.logger.info('Setting access token cookie');

    this.setToken(res, token, TokenName.ACCESS, this.getAccessTokenMaxAge());
  }

  setRefreshToken(res: Response, token: string) {
    this.logger.info('Setting refresh token cookie');

    this.setToken(res, token, TokenName.REFRESH, this.getRefreshTokenMaxAge());
  }

  clearAccessToken(res: Response) {
    this.logger.warn('Clearing access token cookie');

    res.clearCookie(TokenName.ACCESS, this.cookieOptions);
  }

  clearRefreshToken(res: Response) {
    this.logger.warn('Clearing refresh token cookie', {
      token: TokenName.REFRESH,
    });

    res.clearCookie(TokenName.REFRESH, this.cookieOptions);
  }
}
