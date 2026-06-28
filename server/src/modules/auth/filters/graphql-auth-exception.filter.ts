import { Catch, UnauthorizedException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(UnauthorizedException)
export class GraphqlAuthExceptionFilter implements GqlExceptionFilter {
  catch() {
    return new GraphQLError('Unauthorized', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}
