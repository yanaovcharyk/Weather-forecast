/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { vi } from 'vitest';

export type AddCitySelectMockProps = {
  placement?: string;
  getPopupContainer?: () => HTMLElement;
};

export const addCitySelectMock =
  vi.fn<(props: AddCitySelectMockProps) => void>();

export const AddCityFormAntFormMock = Object.assign(
  ({ children, onFinish }: { children: ReactNode; onFinish?: () => void }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onFinish?.();
      }}
    >
      {children}
    </form>
  ),
  {
    Item: ({ children }: { children: ReactNode }) => <>{children}</>,
  },
);

export const AddCitySelectMock = (props: AddCitySelectMockProps) => {
  addCitySelectMock(props);

  return <div data-testid="select" />;
};

export const AddCityButtonMock = ({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <button disabled={disabled} onClick={onClick}>
    {children}
  </button>
);
