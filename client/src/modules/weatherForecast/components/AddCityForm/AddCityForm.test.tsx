import React from 'react';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AddCityForm } from './AddCityForm';

import { useAddCityForm } from '@/weatherForecast/hooks/useAddCityForm';
import { useIsMobile } from '@/common/hooks/useIsMobile';
import {
  createUseAddCityFormResult,
  createFormMock,
  handleSubmitMock,
} from '@/weatherForecast/test/mocks';
import { renderWithUser } from '@/common/test/render/renderWithUser';

vi.mock('@/weatherForecast/hooks/useAddCityForm');
vi.mock('@/common/hooks/useIsMobile');

type SelectProps = {
  placement?: string;
  getPopupContainer?: () => HTMLElement;
};

const selectMock = vi.fn<(props: SelectProps) => void>();

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();

  const FormMock = Object.assign(
    ({
      children,
      onFinish,
    }: {
      children: React.ReactNode;
      onFinish?: () => void;
    }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onFinish?.();
        }}
      >
        {children}
      </form>
    ),
    {
      Item: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
  );

  return {
    ...actual,
    Form: FormMock,
    Select: (props: SelectProps) => {
      selectMock(props);
      return <div data-testid="select" />;
    },

    Button: ({
      children,
      disabled,
      onClick,
    }: {
      children: React.ReactNode;
      disabled?: boolean;
      onClick?: () => void;
    }) => (
      <button disabled={disabled} onClick={onClick}>
        {children}
      </button>
    ),
  };
});

describe('AddCityForm', () => {
  const onSubmit = vi.fn();

  const setup = (
    props: {
      onSubmit: typeof onSubmit;
      disabled: boolean;
    } = {
      onSubmit,
      disabled: false,
    },
  ) => {
    return renderWithUser(<AddCityForm {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useIsMobile).mockReturnValue(false);

    vi.mocked(useAddCityForm).mockReturnValue(createUseAddCityFormResult());
  });

  it('renders select and submit button', () => {
    setup();

    expect(screen.getByTestId('select')).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /add/i,
      }),
    ).toBeInTheDocument();
  });

  it('calls submit handler', async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole('button', {
        name: /add/i,
      }),
    );

    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled', () => {
    setup({
      onSubmit,
      disabled: true,
    });

    expect(
      screen.getByRole('button', {
        name: /add/i,
      }),
    ).toBeDisabled();
  });

  it('passes getPopupContainer returning document.body', () => {
    setup();

    expect(selectMock).toHaveBeenCalled();

    const props = selectMock.mock.calls[0][0];

    expect(props.getPopupContainer).toBeDefined();
    expect(props.getPopupContainer?.()).toBe(document.body);
  });

  it('uses topLeft placement on mobile', () => {
    vi.mocked(useIsMobile).mockReturnValue(true);

    setup();

    const props = selectMock.mock.calls[0][0];

    expect(props.placement).toBe('topLeft');
  });

  it('renders with form error', () => {
    vi.mocked(useAddCityForm).mockReturnValue(
      createUseAddCityFormResult({
        form: createFormMock(['error']),
      }),
    );

    setup();

    expect(screen.getByTestId('select')).toBeInTheDocument();
  });
});
