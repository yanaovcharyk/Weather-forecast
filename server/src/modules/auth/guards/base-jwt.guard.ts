import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { IGQLContext, JwtPayload } from '@auth/interfaces';
import { Request } from 'express';
import { AuthCookieService } from '@auth/services';
import { AUTH_GRAPHQL_ERRORS } from '@auth/constants';

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
      throw AUTH_GRAPHQL_ERRORS.UNAUTHORIZED;
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
      throw AUTH_GRAPHQL_ERRORS.UNAUTHORIZED;
    }
  }
}
