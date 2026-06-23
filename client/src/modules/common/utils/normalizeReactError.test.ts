import { describe, expect, it } from 'vitest';

import { normalizeReactError } from './normalizeReactError';

describe('normalizeReactError', () => {
  it('normalizes react error', () => {
    const error = new Error('Something failed');

    const info = {
      componentStack: `
        App
        Page
        Button
      `,
    };

    const result = normalizeReactError(error, info as React.ErrorInfo);

    expect(result).toEqual({
      name: 'Error',
      message: 'Something failed',
      stack: error.stack,

      ui: {
        rootComponent: 'App',
        componentChain: ['App', 'Page', 'Button'],
        stackDepth: 3,
      },
    });
  });

  it('handles empty stack', () => {
    const error = new Error('Oops');

    const result = normalizeReactError(error, {
      componentStack: '',
    } as React.ErrorInfo);

    expect(result.ui).toEqual({
      rootComponent: null,
      componentChain: [],
      stackDepth: 0,
    });
  });
});
