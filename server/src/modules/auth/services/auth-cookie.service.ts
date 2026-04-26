import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { AppConfig } from '../../../shared/types/app.config';

enum TokenName {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

type MsString = `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`;

@Injectable()
export class AuthCookieService {
  constructor(private readonly config: ConfigService<AppConfig>) {}

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
    return req.cookies?.accessToken ?? null;
  }

  getRefreshToken(req: Request): string | null {
    return req.cookies?.refreshToken ?? null;
  }

  private getAccessTokenMaxAge(): number {
    const expires = this.config.get('jwt.accessExpires', { infer: true });

    if (!expires) {
      throw new Error('jwt.accessExpires is not defined');
    }

    return this.parseMs(expires);
  }

  private getRefreshTokenMaxAge(): number {
    const expires = this.config.get('jwt.refreshExpires', { infer: true });

    if (!expires) {
      throw new Error('jwt.refreshExpires is not defined');
    }

    return this.parseMs(expires);
  }

  private parseMs(value: MsString): number {
    const result = ms(value);

    if (typeof result !== 'number') {
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
    res.cookie(name, token, {
      ...this.cookieOptions,
      maxAge,
    });
  }

  setAccessToken(res: Response, token: string) {
    this.setToken(
      res,
      token,
      TokenName.ACCESS,
      this.getAccessTokenMaxAge(),
    );
  }

  setRefreshToken(res: Response, token: string) {
    this.setToken(
      res,
      token,
      TokenName.REFRESH,
      this.getRefreshTokenMaxAge(),
    );
  }

  clearAccessToken(res: Response) {
    res.clearCookie(TokenName.ACCESS, this.cookieOptions);
  }

  clearRefreshToken(res: Response) {
    res.clearCookie(TokenName.REFRESH, this.cookieOptions);
  }
}
