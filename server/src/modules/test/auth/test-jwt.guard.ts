import { Request } from 'express';

import { BaseJwtGuard } from '@auth/guards/base-jwt.guard';
import { JwtPayload } from '@auth/interfaces';

export class TestJwtGuard extends BaseJwtGuard {
  public readonly getTokenMock = jest.fn();
  public readonly getSecretMock = jest.fn();
  public readonly validatePayloadMock = jest.fn();

  protected getToken(req: Request): string | null {
    return this.getTokenMock(req);
  }

  protected getSecret(): string {
    return this.getSecretMock();
  }

  protected validatePayload(
    payload: JwtPayload,
    token: string,
  ): void {
    this.validatePayloadMock(payload, token);
  }
}
