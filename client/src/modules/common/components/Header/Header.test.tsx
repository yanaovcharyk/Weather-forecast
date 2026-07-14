import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Header } from './Header';
import type { ConfirmModalProps } from '@/common/components/ConfirmModal/ConfirmModal';

const logoutMock = vi.fn();
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
}));

vi.mock('@/auth/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    logout: logoutMock,
    refreshSession: vi.fn(),
  }),
}));

const setup = () => {
  render(<Header />);

  return {
    getLogoutButton: () => screen.getByRole('button'),
    getCancelButton: () =>
      screen.getByRole('button', {
        name: 'Cancel',
      }),
    getLogoutConfirmButton: () =>
      screen.getByRole('button', {
        name: 'Logout',
      }),
    getLastConfirmModalProps: () => confirmModalProps.mock.calls.at(-1)?.[0],
  };
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    logoutMock.mockResolvedValue(undefined);
  });

  it('should render application title', () => {
    setup();

    expect(screen.getByText('Weather')).toBeInTheDocument();
  });

  it('should open logout modal after click', async () => {
    const { getLogoutButton } = setup();

    fireEvent.click(getLogoutButton());

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('should close logout modal when cancel callback is executed', async () => {
    const { getLastConfirmModalProps, getLogoutButton } = setup();

    const props = getLastConfirmModalProps();

    expect(props.visible).toBe(false);

    fireEvent.click(getLogoutButton());

    await waitFor(() => {
      const openedProps = getLastConfirmModalProps();

      expect(openedProps.visible).toBe(true);
    });

    const openedProps = getLastConfirmModalProps();

    openedProps.onCancel();

    await waitFor(() => {
      const closedProps = getLastConfirmModalProps();

      expect(closedProps.visible).toBe(false);
    });
  });

  it('should close modal when cancel is clicked', async () => {
    const { getCancelButton, getLogoutButton } = setup();

    fireEvent.click(getLogoutButton());

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    fireEvent.click(getCancelButton());

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should logout', async () => {
    const { getLogoutButton, getLogoutConfirmButton } = setup();

    fireEvent.click(getLogoutButton());

    fireEvent.click(getLogoutConfirmButton());

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
  });
});
