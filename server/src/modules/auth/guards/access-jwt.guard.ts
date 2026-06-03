import { ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { LoggerContextService } from '../../logger/services/logger-context.service';

export function createJwtAuthGuard(strategy: string): Type<any> {
  @Injectable()
  class JwtAuthGuard extends AuthGuard(strategy) {
    private readonly logger;

    constructor(
      loggerService: AppLoggerService,
      private readonly loggerContextService: LoggerContextService,
    ) {
      super();
      this.logger = loggerService.child('JwtAuthGuard');
    }

    getRequest(context: ExecutionContext) {
      const req = GqlExecutionContext.create(context).getContext().req;
      this.loggerContextService.printContext('JWT GUARD');

      this.logger.debug('JWT guard extracting request', {
        strategy,
        ip: req.ip,
      });

      return req;
    }

    handleRequest<TUser = any>(err: unknown, user: TUser): TUser {
      return this.assertAuthenticatedUser(err, user);
    }

    private assertAuthenticatedUser<TUser>(err: unknown, user: TUser): TUser {
      if (err || !user) {
        this.logger.warn('Unauthorized access attempt', {
          strategy,
          error: err instanceof Error ? err.message : undefined,
        });

        throw new GraphQLError('Unauthorized access', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      this.logger.debug('JWT authentication successful', {
        strategy,
      });

      return user;
    }
  }

  return mixin(JwtAuthGuard);
}

export const AccessJwtGuard = createJwtAuthGuard('jwt');
export const RefreshJwtGuard = createJwtAuthGuard('jwt-refresh');
