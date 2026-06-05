import { Injectable } from '@nestjs/common';
import { BaseJwtGuard } from './base-jwt.guard';

@Injectable()
export class AccessJwtGuard extends BaseJwtGuard {
  protected getToken(req: any): string | null {
    return req.cookies?.accessToken ?? null;
  }

  protected getSecret(): string {
    return this.configService.get<string>('jwt.accessSecret')!;
  }

  protected validatePayload(payload: any) {
    if (payload.type !== 'access') {
      throw new Error('Invalid token type');
    }
  }
}
