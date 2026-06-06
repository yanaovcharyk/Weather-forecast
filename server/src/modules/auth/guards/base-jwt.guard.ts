import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { IGQLContext, JwtPayload } from '../interfaces';
import { Request } from 'express';
import { AuthCookieService } from '../services';

@Injectable()
export abstract class BaseJwtGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly authCookieService: AuthCookieService,
  ) {}

  protected abstract getToken(req: Request): string | null;
  protected abstract getSecret(): string;
  protected abstract validatePayload(payload: JwtPayload, token: string): any;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext<IGQLContext>();
    const req = ctx.req;

    console.log('COOKIES', req.cookies);
    const token = this.getToken(req);

    if (!token) {
      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: this.getSecret(),
        },
      );

      console.log('TOKEN PAYLOAD', tokenPayload);

      ctx.jwtPayload = tokenPayload;
      ctx.jwtToken = token;

      return true;
    } catch (error) {
      console.error('JWT VERIFY FAILED');
      console.error(error);

      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
  }
}
