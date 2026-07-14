import type { ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { createLogger } from '@/logger/utils/createLogger';
import { normalizeReactError } from '@/common/utils/normalizeReactError';

type Props = {
  children?: ReactNode;
  onError?: () => void;
};

const logger = createLogger('LoggerError');

const toError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
};

export const LoggerError = ({ children, onError }: Props) => {
  const handleError = (error: unknown, info: ErrorInfo) => {
    logger.error('react.render.crash', {
      error: normalizeReactError(toError(error), info),
    });

    onError?.();
  };

  return (
    <ReactErrorBoundary fallback={null} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
};
