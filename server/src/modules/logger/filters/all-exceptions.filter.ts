import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { GraphQLError } from 'graphql';
import { AppLoggerService } from '@logger/services';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger;

  constructor(loggerService: AppLoggerService) {
    this.logger = loggerService.child(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const isGraphQL = host.getType<'graphql'>() === 'graphql';

    const message =
      exception instanceof Error ? exception.message : 'Unknown error';

    const stack = exception instanceof Error ? exception.stack : undefined;

    const isHttpException = exception instanceof HttpException;

    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (statusCode >= 500) {
      this.logger.error(message, stack ? new Error(stack) : undefined, {
        statusCode,
        isGraphQL,
      });
    } else {
      this.logger.warn(message, {
        statusCode,
        isGraphQL,
      });
    }

    if (isGraphQL) {
      if (exception instanceof GraphQLError) {
        throw exception;
      }

      if (isHttpException) {
        throw new GraphQLError(message, {
          extensions: {
            code:
              statusCode === 401 ? 'UNAUTHENTICATED' : 'INTERNAL_SERVER_ERROR',
            statusCode,
          },
        });
      }

      throw new GraphQLError('Internal server error', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }

    throw exception;
  }
}
