import { GraphQLError } from "graphql/error";

export const PBKDF2_ITERATIONS = 100_000;
export const PBKDF2_KEY_LENGTH = 64;
export const PBKDF2_DIGEST_ALGORITHM = 'sha512';
export const PBKDF2_ENCODING = 'hex';

export enum AuthErrorMessage {
  COMPARISON_FAILED = 'Password comparison failed',
  JWT_VERIFICATION_FAILED = 'JWT verification failed',
}

export const AUTH_GRAPHQL_ERRORS = {
  UNAUTHORIZED: new GraphQLError('Unauthorized', {
    extensions: { code: 'UNAUTHENTICATED' },
  }),
};