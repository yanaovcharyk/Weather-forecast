import { Flex, Layout } from 'antd';
import styles from './PageLayout.module.scss';

const { Header, Content, Footer } = Layout;

export const PageLayout = ({
  header,
  footer,
  children,
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Layout className={styles.layout}>
      {header && <Header className={styles.header}>{header}</Header>}

      <Content className={styles.content}>
        <Flex justify="center">
          <div className={styles.container}>{children}</div>
        </Flex>
      </Content>

      {footer && <Footer className={styles.footer}>{footer}</Footer>}
    </Layout>
  );
};
