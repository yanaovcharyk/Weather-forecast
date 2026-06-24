import { CenteredLayout, AppCard } from '@/common/components';
import { LoginForm } from '@/auth/components/LoginForm';
import Title from 'antd/es/typography/Title';
import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  return (
    <CenteredLayout>
      <AppCard
        title={<Title level={4}>Login</Title>}
        className={styles.formLogin}
      >
        <LoginForm />
      </AppCard>
    </CenteredLayout>
  );
};
