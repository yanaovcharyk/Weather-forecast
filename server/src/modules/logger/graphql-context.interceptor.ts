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
export class GraphqlContextInterceptor implements NestInterceptor {
  constructor(private readonly contextService: LoggerContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gql = GqlExecutionContext.create(context);

    console.log('FIELD:', gql.getInfo()?.fieldName);

    return this.contextService.run(
      {
        requestId: gql.getContext().requestId,
        userId: gql.getContext().req?.user?.userId,
        ip: gql.getContext().req?.ip,
      },
      () => next.handle(),
    );
  }
}
