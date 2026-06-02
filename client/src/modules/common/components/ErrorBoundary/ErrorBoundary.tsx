import React from 'react';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import { createLogger } from '@/logger/utils/createLogger';
import { normalizeReactError } from '../../utils/normalizeReactError';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

const errorBoundaryLogger = createLogger('ErrorBoundary');
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

    errorBoundaryLogger.error('React render crash', {
      error: normalizedError,

      ui: {
        rootComponent: normalizedError.ui.rootComponent,
        stackDepth: normalizedError.ui.stackDepth,
      },
    });

    errorBoundaryLogger.debug('React error debug snapshot', {
      componentStackSize: normalizedError.ui.stackDepth,
      errorName: error.name,
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
