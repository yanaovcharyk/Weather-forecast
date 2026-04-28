import { Flex, Layout } from 'antd';
import styles from './CenteredLayout.module.scss';

export const CenteredLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout className={styles.layout}>
      <Flex align="center" justify="center" className={styles.flex}>
        {children}
      </Flex>
    </Layout>
  );
};
