import { Injectable } from '@nestjs/common';
import { BaseJwtGuard } from './base-jwt.guard';
import { IRefreshJwtPayload } from '@auth/interfaces';
import { Request } from 'express';
import { TokenType } from '@auth/types';

@Injectable()
export class RefreshJwtGuard extends BaseJwtGuard {
  protected getToken(req: Request): string | null {
    return this.authCookieService.getRefreshToken(req);
  }

  protected getSecret(): string {
    return this.configService.get<string>('jwt.refreshSecret')!;
  }

  protected validatePayload(payload: IRefreshJwtPayload, token: string) {
    if (payload.type !== TokenType.REFRESH) {
      throw new Error('Invalid token type');
    }
  }
}
