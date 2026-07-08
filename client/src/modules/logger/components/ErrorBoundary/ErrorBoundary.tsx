import React from 'react';
import { createLogger } from '@/logger/utils/createLogger';
import { normalizeReactError } from '@/common/utils/normalizeReactError';
import { ErrorPage } from '@/common/components/ErrorPage/ErrorPage';

type Props = {
  children?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

const logger = createLogger('ErrorBoundary');

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    const normalizedError = normalizeReactError(error, info);

    logger.error('react.render.crash', {
      error: normalizedError,
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
