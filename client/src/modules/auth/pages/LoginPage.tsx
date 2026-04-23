import { CenteredLayout } from '@/shared/components';
import { FormCard } from '@/shared/components/Form/FormCard';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <CenteredLayout>
      <FormCard title="Login" style={{ margin: 24 }}>
        <LoginForm />
      </FormCard>
    </CenteredLayout>
  );
};
