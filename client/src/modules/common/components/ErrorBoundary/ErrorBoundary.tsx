import React from 'react';
import { logger } from '../../../logger/services/LoggerService';
import { ErrorPage } from '../ErrorPage/ErrorPage';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

function cleanComponentStack(stack?: string | null) {
  if (!stack) {
    return [];
  }

  return stack
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((line) => {
      return (
        !line.includes('node_modules') &&
        !line.includes('antd') &&
        !line.includes('react-router') &&
        !line.includes('react-dom')
      );
    });
}

function normalizeReactError(error: Error, info: React.ErrorInfo) {
  const cleanedStack = cleanComponentStack(info.componentStack);

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,

    ui: {
      rootComponent: cleanedStack[0] ?? null,
      componentChain: cleanedStack.slice(0, 10),
      stackDepth: cleanedStack.length,
    },
  };
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const normalizedError = normalizeReactError(error, info);

    logger.error('React render crash', {
      module: 'React',
      route: window.location.pathname,

      error: normalizedError,

      ui: {
        rootComponent: normalizedError.ui.rootComponent,
        stackDepth: normalizedError.ui.stackDepth,
      },
    });

    logger.debug('React error debug snapshot', {
      module: 'React',
      route: window.location.pathname,
      componentStackSize: normalizedError.ui.stackDepth,
      errorName: error.name,
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
