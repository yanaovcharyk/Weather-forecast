import { Injectable } from '@nestjs/common';
import { BaseJwtGuard } from './base-jwt.guard';
import { IRefreshJwtPayload } from '../interfaces';
import { Request } from 'express';
import { TokenType } from '../types';

@Injectable()
export class RefreshJwtGuard extends BaseJwtGuard {
  protected getToken(req: Request): string | null {
    return req.cookies?.refreshToken ?? null;
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
