import { Form, Input } from 'antd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLogin } from '../hooks/useLogin';
import { schema, type LoginFormValues } from '../types';
import { FormField } from '@/shared/components/Form/FormInput';
import { PrimaryButton } from '@/shared/components/Button/PrimaryButton';

export const LoginForm = () => {
  const { submit, loading } = useLogin();

  const { handleSubmit, control } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(submit)}
      style={{ padding: 16, color: '#234C75' }}
    >
      <FormField<LoginFormValues>
        name="email"
        control={control}
        label="Email"
        style={{ marginBottom: 4 }}
      >
        {(field) => <Input {...field} style={{ color: '#234C75' }} />}
      </FormField>

      <FormField<LoginFormValues>
        name="password"
        control={control}
        label="Password"
      >
        {(field) => <Input.Password {...field} style={{ color: '#234C75' }} />}
      </FormField>

      <PrimaryButton htmlType="submit" block loading={loading}>
        Login
      </PrimaryButton>
    </Form>
  );
};
