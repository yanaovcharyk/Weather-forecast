import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createApolloClient: vi.fn(),
  logout: vi.fn(),
  toast: vi.fn(),
}));

vi.mock('..', () => ({
  createApolloClient: mocks.createApolloClient,
}));

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    logout: mocks.logout,
  }),
}));

vi.mock('@/common/hooks/useToast', () => ({
  useToast: () => ({
    toast: mocks.toast,
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

    expect(mocks.toast).toHaveBeenCalledWith('error', 'Error');
  });
});
