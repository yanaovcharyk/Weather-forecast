import { Injectable } from '@nestjs/common';
import { Response, Request, CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@shared/types';
import { TokenName } from '@auth/types';
import { AppLoggerService } from '@logger/services';
import { LogMethod } from '@logger/decorators';
import { parseMs } from '@shared/utils/parse-ms';
import { authCookieConfig } from '@auth/config';

@Injectable()
export class AuthCookieService {
  private readonly logger;
  private readonly cookieOptions: CookieOptions;

  constructor(
    private readonly config: ConfigService<IAppConfig>,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(AuthCookieService.name);
    this.cookieOptions = authCookieConfig(this.config);
  }

  @LogMethod()
  getAccessToken(req: Request): string | null {
    return this.getToken(req, TokenName.ACCESS);
  }

  @LogMethod()
  getRefreshToken(req: Request): string | null {
    return this.getToken(req, TokenName.REFRESH);
  }

  @LogMethod()
  setAccessToken(res: Response, token: string): void {
    this.setToken(
      res,
      token,
      TokenName.ACCESS,
      this.getTokenMaxAge('jwt.accessExpires'),
    );
  }

  @LogMethod()
  setRefreshToken(res: Response, token: string): void {
    this.setToken(
      res,
      token,
      TokenName.REFRESH,
      this.getTokenMaxAge('jwt.refreshExpires'),
    );
  }

  @LogMethod()
  clearAccessToken(res: Response): void {
    this.clearToken(res, TokenName.ACCESS);
  }

  @LogMethod()
  clearRefreshToken(res: Response): void {
    this.clearToken(res, TokenName.REFRESH);
  }

  @LogMethod()
  clearAuthCookies(res: Response): void {
    this.clearToken(res, TokenName.ACCESS);
    this.clearToken(res, TokenName.REFRESH);
  }

  private getToken(req: Request, tokenName: TokenName): string | null {
    return req.cookies?.[tokenName] ?? null;
  }

  private clearToken(res: Response, tokenName: TokenName): void {
    res.clearCookie(tokenName, this.cookieOptions);
  }

  private getTokenMaxAge(
    configKey: 'jwt.accessExpires' | 'jwt.refreshExpires',
  ): number {
    const expires = this.config.getOrThrow(configKey, {
      infer: true,
    });

    return parseMs(expires);
  }

  private setToken(
    res: Response,
    token: string,
    tokenName: TokenName,
    maxAge: number,
  ): void {
    res.cookie(tokenName, token, {
      ...this.cookieOptions,
      maxAge,
    });
  }
}
