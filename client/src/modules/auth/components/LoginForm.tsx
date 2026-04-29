import { Form, Input, theme } from 'antd';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLogin } from '../hooks/useLogin';
import { schema, type LoginFormValues } from '../types';
import { PrimaryButton } from '../../common/components';

export const LoginForm = () => {
  const { token } = theme.useToken();
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

  const inputStyle = { color: token.colorPrimary };

  return (
    <Form layout="vertical" onFinish={handleSubmit(loginUser)}>
      <Form.Item
        label="Email"
        validateStatus={email.fieldState.error ? 'error' : undefined}
        help={email.fieldState.error?.message}
      >
        <Input {...email.field} style={inputStyle} />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={password.fieldState.error ? 'error' : undefined}
        help={password.fieldState.error?.message}
      >
        <Input.Password {...password.field} style={inputStyle} />
      </Form.Item>

      <PrimaryButton htmlType="submit" block loading={loading}>
        Login
      </PrimaryButton>
    </Form>
  );
};
