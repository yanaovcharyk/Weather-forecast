import { Space, Alert } from 'antd';
import { PageLayout } from '@/common/components/Layouts/PageLayout/PageLayout';
import { Header } from '@/common/components/Header/Header';
import styles from './ErrorPage.module.scss';

export const ErrorPage = () => {
  return (
    <PageLayout header={<Header />}>
      <Space orientation="vertical" size="large" className={styles.container}>
        <Alert
          type="error"
          title="Technical work in progress."
          description="Please try again later."
        />
      </Space>
    </PageLayout>
  );
};
