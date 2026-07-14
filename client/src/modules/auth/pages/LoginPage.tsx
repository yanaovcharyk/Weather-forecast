import { CenteredLayout, StyledCard, AppTitle } from '@/common/components';
import { LoginForm } from '@/auth/components/LoginForm';
import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  return (
    <CenteredLayout>
      <StyledCard
        title={<AppTitle level={4}>Login</AppTitle>}
        className={styles.formLogin}
      >
        <LoginForm />
      </StyledCard>
    </CenteredLayout>
  );
};
