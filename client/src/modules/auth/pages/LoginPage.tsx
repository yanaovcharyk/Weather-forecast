import { CenteredLayout, FormCard } from '../../common/components';
import { LoginForm } from '../components/LoginForm';
import Title from 'antd/es/typography/Title';

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
