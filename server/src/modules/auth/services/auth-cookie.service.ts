import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { AppConfig } from '../../../shared/types/app.config';
import { TokenName, Tokens } from '../types/token';

type MsString = `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`;

@Injectable()
export class AuthCookieService {
  private readonly isProd: boolean;

  constructor(private readonly config: ConfigService<AppConfig>) {
    this.isProd = this.config.get('nodeEnv', { infer: true }) === 'production';
  }

  getAccessToken(req: Request): string | null {
    return req.cookies?.accessToken ?? null;
  }

  getRefreshToken(req: Request): string | null {
    return req.cookies?.refreshToken ?? null;
  }

  getRefreshTokenOrThrow(req: Request): string {
    const token = this.getRefreshToken(req);

    if (!token) {
      throw new Error('Refresh token not found');
    }

    return token;
  }

  setAuthCookies(res: Response, tokens: Tokens) {
    console.log(`🍪 SET access + refresh cookies`);

    this.setCookie(
      res,
      TokenName.ACCESS,
      tokens.accessToken,
      this.getMaxAge('jwt.accessExpires'),
    );

    this.setCookie(
      res,
      TokenName.REFRESH,
      tokens.refreshToken,
      this.getMaxAge('jwt.refreshExpires'),
    );
  }

  clearAuthCookies(res: Response) {
    res.clearCookie(TokenName.ACCESS, this.baseOptions);
    res.clearCookie(TokenName.REFRESH, this.baseOptions);
  }

  private readonly baseOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
  };

  private setCookie(
    res: Response,
    name: TokenName,
    value: string,
    maxAge: number,
  ) {
    res.cookie(name, value, {
      ...this.baseOptions,
      secure: this.isProd,
      maxAge,
    });
  }

  private getMaxAge(key: 'jwt.accessExpires' | 'jwt.refreshExpires'): number {
    const value = this.config.get<string>(key, { infer: true });

    if (!value) {
      throw new Error(`${key} is not defined`);
    }

    return this.parseMs(value as MsString);
  }

  private parseMs(value: MsString): number {
    const result = ms(value);

    if (!result) {
      throw new Error(`Invalid ms value: ${value}`);
    }

    return result;
  }
}
