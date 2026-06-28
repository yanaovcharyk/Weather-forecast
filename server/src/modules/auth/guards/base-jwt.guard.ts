import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IGQLContext, JwtPayload } from '@auth/interfaces';
import { Request } from 'express';
import { AuthCookieService } from '@auth/services';

@Injectable()
export abstract class BaseJwtGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly authCookieService: AuthCookieService,
  ) {}

  protected abstract getToken(req: Request): string | null;
  protected abstract getSecret(): string;
  protected abstract validatePayload(payload: JwtPayload, token: string): void;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext<IGQLContext>();
    const req = ctx.req;
    const token = this.getToken(req);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: this.getSecret(),
        },
      );

      this.validatePayload(tokenPayload, token);

      ctx.jwtPayload = tokenPayload;
      ctx.jwtToken = token;

      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
