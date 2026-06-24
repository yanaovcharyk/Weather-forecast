import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Header } from './Header';
import type { ConfirmModalProps } from '@/common/components/ConfirmModal/ConfirmModal';

const navigateMock = vi.fn();
const logoutMock = vi.fn();
const clearStoreMock = vi.fn();
const confirmModalProps = vi.fn();

vi.mock('@/common/components/ConfirmModal/ConfirmModal', () => ({
  ConfirmModal: (props: ConfirmModalProps) => {
    confirmModalProps(props);

    if (!props.visible) {
      return null;
    }

    return (
      <div role="dialog">
        <h1>{props.title}</h1>
        <p>{props.content}</p>

        <button onClick={props.onOk}>{props.okText}</button>

        <button onClick={props.onCancel}>{props.cancelText}</button>
      </div>
    );
  },
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children }: React.PropsWithChildren) => <a>{children}</a>,
  useNavigate: () => navigateMock,
}));

vi.mock('@/auth/hooks/useLogout', () => ({
  useLogout: () => logoutMock,
}));

vi.mock('@apollo/client/react', () => ({
  useApolloClient: () => ({
    clearStore: clearStoreMock,
  }),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    logoutMock.mockResolvedValue(undefined);
    clearStoreMock.mockResolvedValue(undefined);
  });

  it('should render application title', () => {
    render(<Header />);

    expect(screen.getByText('Weather')).toBeInTheDocument();
  });

  it('should open logout modal after click', async () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button'));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('should close logout modal when cancel callback is executed', async () => {
    render(<Header />);

    const props = confirmModalProps.mock.calls.at(-1)?.[0];

    expect(props.visible).toBe(false);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      const openedProps = confirmModalProps.mock.calls.at(-1)?.[0];

      expect(openedProps.visible).toBe(true);
    });

    const openedProps = confirmModalProps.mock.calls.at(-1)?.[0];

    openedProps.onCancel();

    await waitFor(() => {
      const closedProps = confirmModalProps.mock.calls.at(-1)?.[0];

      expect(closedProps.visible).toBe(false);
    });
  });

  it('should close modal when cancel is clicked', async () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button'));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancel',
      }),
    );

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should logout, clear apollo cache and navigate to login', async () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button'));

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Logout',
      }),
    );

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(clearStoreMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/login');
    });

    expect(logoutMock.mock.invocationCallOrder[0]).toBeLessThan(
      clearStoreMock.mock.invocationCallOrder[0],
    );

    expect(clearStoreMock.mock.invocationCallOrder[0]).toBeLessThan(
      navigateMock.mock.invocationCallOrder[0],
    );
  });
});
