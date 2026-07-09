import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createApolloClient: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('..', () => ({
  createApolloClient: mocks.createApolloClient,
}));

vi.mock('@/common/hooks/useToast', () => ({
  useToast: () => ({
    error: mocks.toastError,
  }),
}));

vi.mock('@apollo/client/react', () => ({
  ApolloProvider: ({ children }: React.PropsWithChildren) => children,
}));

import { AppApolloProvider } from './AppApolloProvider';

describe('AppApolloProvider', () => {
  it('creates client', () => {
    mocks.createApolloClient.mockReturnValue({});

    render(
      <AppApolloProvider>
        <div>test</div>
      </AppApolloProvider>,
    );

    expect(mocks.createApolloClient).toHaveBeenCalled();

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('uses toast callback', () => {
    let callback!: (msg: string) => void;

    mocks.createApolloClient.mockImplementation(({ displayErrorMessage }) => {
      callback = displayErrorMessage;
      return {};
    });

    render(
      <AppApolloProvider>
        <div />
      </AppApolloProvider>,
    );

    callback('Error');

    expect(mocks.toastError).toHaveBeenCalledWith('Error');
  });
});
