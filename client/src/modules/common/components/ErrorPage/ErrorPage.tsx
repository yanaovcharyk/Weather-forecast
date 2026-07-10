import { Space, Alert } from 'antd';
import { PageLayout, Header } from '@/common/components';

import styles from './ErrorPage.module.scss';

type ErrorPageProps = {
  title?: string;
  description?: string;
};

export const ErrorPage = ({
  title = 'Technical work in progress.',
  description = 'Please try again later.',
}: ErrorPageProps) => {
  return (
    <PageLayout header={<Header />}>
      <Space orientation="vertical" size="large" className={styles.container}>
        <Alert type="error" title={title} description={description} />
      </Space>
    </PageLayout>
  );
};
