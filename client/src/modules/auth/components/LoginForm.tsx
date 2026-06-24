import { Form, Input } from 'antd';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/auth/hooks/useLogin';
import { PrimaryButton } from '@/common/components';
import { loginFormSchema, type LoginFormInput } from '@/auth/validation';

export const LoginForm = () => {
  const { loginUser, loading } = useLogin();

  const { handleSubmit, control } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = useController<LoginFormInput>({ name: 'email', control });
  const password = useController<LoginFormInput>({
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
        <Input {...email.field} aria-label="Email" />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={password.fieldState.error ? 'error' : undefined}
        help={password.fieldState.error?.message}
      >
        <Input.Password {...password.field} aria-label="Password" />
      </Form.Item>

      <PrimaryButton htmlType="submit" block loading={loading}>
        Login
      </PrimaryButton>
    </Form>
  );
};
