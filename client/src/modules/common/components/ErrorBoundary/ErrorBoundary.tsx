import React from 'react';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import { errorBoundaryLogger } from '../../../logger/loggers';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

function cleanComponentStack(stack?: string | null): string[] {
  if (!stack) {
    return [];
  }

  return stack
    .split('\n')
    .map((line) => line.trim())
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
