import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException)
export class GraphqlAuthExceptionFilter implements GqlExceptionFilter {
  catch(exception: UnauthorizedException) {
    return new GraphQLError('Unauthorized', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}
