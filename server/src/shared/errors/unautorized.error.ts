import { GraphQLError } from 'graphql/error';

export function throwUnauthorized(message = 'Unauthorized'): never {
  throw new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED' } });
}
