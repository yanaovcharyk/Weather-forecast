import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { LoggerContextService } from './services/logger-context.service';


@Injectable()
export class GraphqlContextInterceptor
  implements NestInterceptor
{
  constructor(
    private readonly contextService: LoggerContextService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const gql = GqlExecutionContext.create(context);

    const ctx = gql.getContext();

    return this.contextService.run(
      {
        requestId: ctx.requestId,
        userId: ctx.req?.user?.userId,
        ip: ctx.req?.ip,
      },
      () => next.handle(),
    );
  }
}
