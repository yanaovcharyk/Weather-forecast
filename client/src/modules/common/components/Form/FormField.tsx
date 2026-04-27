import { Form } from 'antd';
import {
  Controller,
  type ControllerProps,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from 'react-hook-form';

type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label: string;
  children: (
    field: ControllerRenderProps<TFieldValues, TName>,
  ) => React.ReactNode;
} & React.ComponentProps<typeof Form.Item>;

export function FormField<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
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
