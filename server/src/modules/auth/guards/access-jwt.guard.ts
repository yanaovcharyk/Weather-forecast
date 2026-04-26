import { ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

export function createJwtAuthGuard(strategy: string): Type<any> {
  @Injectable()
  class JwtAuthGuard extends AuthGuard(strategy) {
    getRequest(context: ExecutionContext) {
      return GqlExecutionContext.create(context).getContext().req;
    }

    handleRequest<TUser = any>(
      err: unknown,
      user: TUser,
    ): TUser {
      return this.assertAuthenticatedUser(err, user);
    }

    private assertAuthenticatedUser<TUser>(
      err: unknown,
      user: TUser,
    ): TUser {
      if (err || !user) {
        throw new GraphQLError('Unauthorized access', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return user;
    }
  }

  return mixin(JwtAuthGuard);
}

export const AccessJwtGuard = createJwtAuthGuard('jwt');
export const RefreshJwtGuard = createJwtAuthGuard('jwt-refresh');
