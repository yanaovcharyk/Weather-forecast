import { CenteredLayout, AppCard, AppTitle } from '@/common/components';
import { LoginForm } from '@/auth/components/LoginForm';
import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  return (
    <CenteredLayout>
      <AppCard
        title={<AppTitle level={4}>Login</AppTitle>}
        className={styles.formLogin}
      >
        <LoginForm />
      </AppCard>
    </CenteredLayout>
  );
};
