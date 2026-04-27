import type { GraphQLFormattedError } from 'graphql';

type WithCode = {
  extensions?: {
    code?: unknown;
  };
};

export const extractErrorCode = (err: unknown): string | undefined => {
  if (!err || typeof err !== 'object') return undefined;

  const maybeError = err as Partial<GraphQLFormattedError> & {
    result?: { errors?: (GraphQLFormattedError & WithCode)[] };
  };

  const code =
    maybeError.extensions?.code ??
    maybeError.result?.errors?.[0]?.extensions?.code;

  return typeof code === 'string' ? code : undefined;
};

export const isTokenError = (err: unknown): boolean =>
  extractErrorCode(err) === 'UNAUTHENTICATED';

export const isPermissionError = (err: unknown): boolean =>
  extractErrorCode(err) === 'UNAUTHORIZED';
