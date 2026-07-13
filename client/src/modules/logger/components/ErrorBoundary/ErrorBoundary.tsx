import React from 'react';
import { createLogger } from '@/logger/utils/createLogger';
import { normalizeReactError } from '@/common/utils/normalizeReactError';
import { ToastContext } from '@/common/contexts/ToastContext';

type Props = {
  children?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

const logger = createLogger('ErrorBoundary');

export class ErrorBoundary extends React.Component<Props, State> {
  static contextType = ToastContext;

  declare context: React.ContextType<typeof ToastContext>;

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

    this.context?.error('Something went wrong');
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
