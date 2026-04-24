import { CenteredLayout, Title } from '@/shared/components';
import { FormCard } from '@/shared/components/Form/FormCard';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <CenteredLayout>
      <FormCard
        title={
          <Title level={4} style={{ margin: 0, padding: '0, 16px' }}>
            Login
          </Title>
        }
        style={{ margin: 24 }}
      >
        <LoginForm />
      </FormCard>
    </CenteredLayout>
  );
};
