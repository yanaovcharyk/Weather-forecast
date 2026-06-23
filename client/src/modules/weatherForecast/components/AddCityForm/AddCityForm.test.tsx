import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

import { AddCityForm } from './AddCityForm';
import { useAddCityForm } from '@/weatherForecast/hooks/useAddCityForm';
import { useIsMobile } from '@/common/hooks/useIsMobile';
import type { FormInstance } from 'antd';

vi.mock('@/weatherForecast/hooks/useAddCityForm');
vi.mock('@/common/hooks/useIsMobile');

const selectMock = vi.fn();

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

    Select: (props: unknown) => {
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

  const handleSubmit = vi.fn();
  const handleSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useIsMobile).mockReturnValue(false);

    vi.mocked(useAddCityForm).mockReturnValue({
      form: {
        getFieldError: vi.fn().mockReturnValue([]),
      } as never,
      loading: false,
      handleSearch,
      cityOptions: [
        {
          label: 'Kyiv',
          value: 'kyiv',
        },
      ],
      handleSubmit,
    });
  });

  it('renders select and submit button', () => {
    render(<AddCityForm onSubmit={onSubmit} disabled={false} />);

    expect(screen.getByTestId('select')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('calls submit handler', async () => {
    const user = userEvent.setup();

    render(<AddCityForm onSubmit={onSubmit} disabled={false} />);

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled', () => {
    render(<AddCityForm onSubmit={onSubmit} disabled />);

    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('passes getPopupContainer returning document.body', () => {
    render(<AddCityForm onSubmit={onSubmit} disabled={false} />);

    expect(selectMock).toHaveBeenCalled();

    const props = selectMock.mock.calls[0][0] as {
      getPopupContainer?: () => HTMLElement;
    };

    expect(typeof props.getPopupContainer).toBe('function');
    expect(props.getPopupContainer?.()).toBe(document.body);
  });

  it('covers mobile + placement topLeft', () => {
    vi.mocked(useIsMobile).mockReturnValue(true);

    render(<AddCityForm onSubmit={onSubmit} disabled={false} />);

    const props = selectMock.mock.calls[0][0] as {
      placement?: string;
    };

    expect(props.placement).toBe('topLeft');
  });

  it('covers error state (validateStatus = error)', () => {
    vi.mocked(useAddCityForm).mockReturnValue({
      form: {
        getFieldError: vi.fn().mockReturnValue(['error']),
      } as unknown as FormInstance,
      loading: false,
      handleSearch,
      cityOptions: [{ label: 'Kyiv', value: 'kyiv' }],
      handleSubmit,
    });

    render(<AddCityForm onSubmit={onSubmit} disabled={false} />);

    expect(screen.getByTestId('select')).toBeInTheDocument();
  });
});
