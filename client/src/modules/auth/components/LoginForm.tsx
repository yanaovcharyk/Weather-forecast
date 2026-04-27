import { Form, Input, theme } from 'antd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { schema, type LoginFormValues } from '../types';
import { PrimaryButton, FormField } from '@/modules/common/components';

export const LoginForm = () => {
  const { token } = theme.useToken();

  const { submit, loading } = useLogin();

  const { handleSubmit, control } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(submit)}
      style={{ padding: 16 }}
    >
      <FormField<LoginFormValues, 'email'>
        name="email"
        control={control}
        label="Email"
        style={{ marginBottom: 4 }}
      >
        {(field) => <Input {...field} style={{ color: token.colorPrimary }} />}
      </FormField>

      <FormField<LoginFormValues, 'password'>
        name="password"
        control={control}
        label="Password"
      >
        {(field) => (
          <Input.Password {...field} style={{ color: token.colorPrimary }} />
        )}
      </FormField>

      <PrimaryButton htmlType="submit" block loading={loading}>
        Login
      </PrimaryButton>
    </Form>
  );
};
