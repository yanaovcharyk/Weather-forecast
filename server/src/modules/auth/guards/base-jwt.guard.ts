import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Injectable()
export abstract class BaseJwtGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
  ) {}

  protected abstract getToken(req: any): string | null;
  protected abstract getSecret(): string;
  protected abstract validatePayload(payload: any, token: string): any;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const req = ctx.req;

    const token = this.getToken(req);

    if (!token) {
      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(),
      });

      const user = this.validatePayload(payload, token);

      ctx.user = user;

      return true;
    } catch (error) {
      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }
  }
}
