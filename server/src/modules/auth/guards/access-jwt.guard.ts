import { Injectable } from '@nestjs/common';
import { BaseJwtGuard } from './base-jwt.guard';
import { TokenType } from '@auth/types';
import { IAccessJwtPayload } from '@auth/interfaces';
import { Request } from 'express';
import { JwtConfigKey } from '@auth/constants';

@Injectable()
export class AccessJwtGuard extends BaseJwtGuard {
  protected getToken(req: Request): string | null {
    console.log('authCookieService', this.authCookieService);
    return this.authCookieService.getAccessToken(req);
  }

  protected getSecret(): string {
    return this.configService.get<string>(JwtConfigKey.ACCESS_SECRET)!;
  }

  protected validatePayload(payload: IAccessJwtPayload, token: string,) {
    if (payload.type !== TokenType.ACCESS) {
      throw new Error('Invalid token type');
    }
  }
}
