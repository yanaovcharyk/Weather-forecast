import { CenteredLayout, FormCard } from '@/common/components';
import { LoginForm } from '../components/LoginForm';
import Title from 'antd/es/typography/Title';
import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  return (
    <CenteredLayout>
      <FormCard
        title={<Title level={4}>Login</Title>}
        className={styles.formLogin}
      >
        <LoginForm />
      </FormCard>
    </CenteredLayout>
  );
};
