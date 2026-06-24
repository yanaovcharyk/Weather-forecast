import type { ConfirmModalProps } from '@/common/components/ConfirmModal/ConfirmModal';
import type { SelectProps } from 'antd';
import type { ReactNode } from 'react';

type ConfirmModalMockProps = Pick<
  ConfirmModalProps,
  'visible' | 'onOk' | 'onCancel' | 'loading'
>;

type SelectMockProps = Pick<
  SelectProps<string>,
  'value' | 'onChange' | 'disabled' | 'options'
>;

type ButtonMockProps = {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
};

type CheckboxMockProps = {
  checked?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onChange?: (e: { target: { checked: boolean } }) => void;
};

export const ConfirmModalMock = ({
  visible,
  onOk,
  onCancel,
  loading,
}: ConfirmModalMockProps) =>
  visible ? (
    <div role="dialog">
      <button data-testid="confirm-delete" onClick={onOk} disabled={loading}>
        Delete all
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ) : null;

export const SelectMock = ({
  value,
  onChange,
  disabled,
  options = [],
}: SelectMockProps) => (
  <select
    aria-label="sort by"
    value={value == null ? undefined : String(value)}
    onChange={(event) => onChange?.(event.target.value)}
    disabled={disabled}
  >
    {options.map((option) => (
      <option key={String(option.value)} value={String(option.value)}>
        {option.label}
      </option>
    ))}
  </select>
);

export const ButtonMock = ({
  children,
  onClick,
  disabled,
  icon,
}: ButtonMockProps) => (
  <button onClick={onClick} disabled={disabled}>
    {icon}
    {children}
  </button>
);

export const CheckboxMock = ({
  checked,
  disabled,
  onChange,
  children,
}: CheckboxMockProps) => (
  <label>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) =>
        onChange?.({ target: { checked: event.target.checked } })
      }
    />
    {children}
  </label>
);
