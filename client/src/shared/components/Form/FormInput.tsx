import { Form } from 'antd';
import {
  Controller,
  type ControllerProps,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from 'react-hook-form';

type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> = ControllerProps<TFieldValues, TName> & {
  label: string;
  children: (
    field: ControllerRenderProps<TFieldValues, TName>,
  ) => React.ReactNode;
};

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  label,
  children,
  ...controllerProps
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      {...controllerProps}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          validateStatus={fieldState.error ? 'error' : undefined}
          help={fieldState.error?.message}
        >
          {children(field)}
        </Form.Item>
      )}
    />
  );
}
