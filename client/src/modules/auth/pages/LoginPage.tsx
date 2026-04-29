import { CenteredLayout, FormCard } from '@/common/components';
import { LoginForm } from '../components/LoginForm';
import Title from 'antd/es/typography/Title';

export const LoginPage = () => {
  return (
    <CenteredLayout>
      <FormCard title={<Title level={4}>Login</Title>}>
        <LoginForm />
      </FormCard>
    </CenteredLayout>
  );
};
