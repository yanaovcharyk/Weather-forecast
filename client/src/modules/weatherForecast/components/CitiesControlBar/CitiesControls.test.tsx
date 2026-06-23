import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { CitiesControls } from './CitiesControls';

import type { ConfirmModalProps } from '@/common/components/ConfirmModal/ConfirmModal';
import type { SelectProps } from 'antd';
import type { ReactNode } from 'react';

type ConfirmModalMockProps = Pick<
  ConfirmModalProps,
  'visible' | 'onOk' | 'onCancel'
>;

vi.mock('@/common/components', () => ({
  ConfirmModal: ({ visible, onOk, onCancel }: ConfirmModalMockProps) =>
    visible ? (
      <div role="dialog">
        <button data-testid="confirm-delete" onClick={onOk}>
          Delete all
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

type SelectMockProps = Pick<
  SelectProps<string>,
  'value' | 'onChange' | 'disabled'
>;

type ButtonMockProps = {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
};

type CheckboxMockProps = {
  checked?: boolean;
  children?: ReactNode;
  onChange?: (e: { target: { checked: boolean } }) => void;
};

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();

  return {
    ...actual,

    Select: ({ value, onChange, disabled }: SelectMockProps) => (
      <select
        data-testid="select"
        value={value ?? undefined}
        onChange={(e) => onChange?.(e.target.value as string)}
        disabled={disabled}
      >
        <option value="city">City name</option>
        <option value="createdAt">Date added</option>
      </select>
    ),

    Button: ({ children, onClick, disabled, icon }: ButtonMockProps) => (
      <button onClick={onClick} disabled={disabled}>
        {icon}
        {children}
      </button>
    ),

    Checkbox: ({ checked, onChange, children }: CheckboxMockProps) => (
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) =>
            onChange?.({ target: { checked: e.target.checked } })
          }
        />
        {children}
      </label>
    ),
  };
});

type Props = React.ComponentProps<typeof CitiesControls>;

const defaultProps: Props = {
  sorting: {
    sortBy: 'city',
    sortOrder: 'ASC',
  },
  setSorting: vi.fn() as Props['setSorting'],
  onDeleteAll: vi.fn().mockResolvedValue(undefined),
  showPinnedOnly: false,
  setShowPinnedOnly: vi.fn() as Props['setShowPinnedOnly'],
  disabledStates: {
    sorting: false,
    deleteAll: false,
    pinnedFilter: false,
  },
};

const renderComponent = (props: Partial<typeof defaultProps> = {}) =>
  render(<CitiesControls {...defaultProps} {...props} />);

describe('CitiesControls', () => {
  it('renders controls', () => {
    renderComponent();
    expect(screen.getByText(/sort by/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('changes sortBy via select', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.selectOptions(screen.getByTestId('select'), 'createdAt');

    expect(defaultProps.setSorting).toHaveBeenCalledWith(expect.any(Function));
  });

  it('toggles sort order both ways', async () => {
    const setSorting = vi.fn();
    const user = userEvent.setup();

    renderComponent({ setSorting });

    const btn = screen.getAllByRole('button')[0];
    await user.click(btn);

    const updater = setSorting.mock.calls[0][0] as (
      prev: typeof defaultProps.sorting,
    ) => typeof defaultProps.sorting;

    expect(updater({ sortBy: 'city', sortOrder: 'ASC' })).toEqual({
      sortBy: 'city',
      sortOrder: 'DESC',
    });

    expect(updater({ sortBy: 'city', sortOrder: 'DESC' })).toEqual({
      sortBy: 'city',
      sortOrder: 'ASC',
    });
  });

  it('toggles pinned filter', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByRole('checkbox'));

    expect(defaultProps.setShowPinnedOnly).toHaveBeenCalledWith(true);
  });

  it('opens and closes confirmation modal', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByRole('button', { name: /delete all/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /cancel/i,
      }),
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('confirms delete all', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByRole('button', { name: /delete all/i }));

    await user.click(screen.getByTestId('confirm-delete'));

    expect(defaultProps.onDeleteAll).toHaveBeenCalledTimes(1);
  });

  it('disables sorting controls when disabledStates.sorting is true', () => {
    renderComponent({
      disabledStates: {
        sorting: true,
        deleteAll: false,
        pinnedFilter: false,
      },
    });

    expect(screen.getByTestId('select')).toBeDisabled();
    expect(screen.getAllByRole('button')[0]).toBeDisabled();
  });

  it('disables delete all button when disabledStates.deleteAll is true', () => {
    renderComponent({
      disabledStates: {
        sorting: false,
        deleteAll: true,
        pinnedFilter: false,
      },
    });

    expect(screen.getByRole('button', { name: /delete all/i })).toBeDisabled();
  });

  it('updates sortBy value correctly', async () => {
    const user = userEvent.setup();
    const setSorting = vi.fn();

    renderComponent({ setSorting });

    await user.selectOptions(screen.getByTestId('select'), 'createdAt');

    const updater = setSorting.mock.calls[0][0] as (
      prev: typeof defaultProps.sorting,
    ) => typeof defaultProps.sorting;

    expect(
      updater({
        sortBy: 'city',
        sortOrder: 'ASC',
      }),
    ).toEqual({
      sortBy: 'createdAt',
      sortOrder: 'ASC',
    });
  });

  it('renders down icon when sortOrder is DESC', () => {
    renderComponent({
      sorting: {
        sortBy: 'city',
        sortOrder: 'DESC',
      },
    });

    expect(screen.getByLabelText('arrow-down')).toBeInTheDocument();
  });

  it('renders up icon when sortOrder is ASC', () => {
    renderComponent({
      sorting: {
        sortBy: 'city',
        sortOrder: 'ASC',
      },
    });

    expect(screen.getByLabelText('arrow-up')).toBeInTheDocument();
  });
});
