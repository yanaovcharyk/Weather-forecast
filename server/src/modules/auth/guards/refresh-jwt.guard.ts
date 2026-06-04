import { Injectable } from '@nestjs/common';
import { BaseJwtGuard } from './base-jwt.guard';

@Injectable()
export class RefreshJwtGuard extends BaseJwtGuard {
  protected getToken(req: any): string | null {
    return req.cookies?.refreshToken ?? null;
  }

  protected getSecret(): string {
    return this.configService.get<string>('jwt.refreshSecret')!;
  }

  protected validatePayload(payload: any, token: string) {
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return {
      userId: payload.userId,
      version: payload.version,
      type: payload.type,
      refreshToken: token,
    };
  }
}
