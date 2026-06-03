import { Form, Input } from 'antd';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLogin } from '../hooks/useLogin';
import { schema, type LoginFormValues } from '../types';
import { PrimaryButton } from '@/common/components';

export const LoginForm = () => {
  const { loginUser, loading } = useLogin();

  const { handleSubmit, control } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = useController<LoginFormValues>({ name: 'email', control });
  const password = useController<LoginFormValues>({
    name: 'password',
    control,
  });

  return (
    <Form layout="vertical" onFinish={handleSubmit(loginUser)}>
      <Form.Item
        label="Email"
        validateStatus={email.fieldState.error ? 'error' : undefined}
        help={email.fieldState.error?.message}
      >
        <Input {...email.field} />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={password.fieldState.error ? 'error' : undefined}
        help={password.fieldState.error?.message}
      >
        <Input.Password {...password.field} />
      </Form.Item>

      <PrimaryButton htmlType="submit" block loading={loading}>
        Login
      </PrimaryButton>
    </Form>
  );
};
