import { Space, Alert } from 'antd';
import { PageLayout } from '../Layouts/PageLayout/PageLayout';
import { Header } from '../Header/Header';

export const ErrorPage = () => {
  return (
    <PageLayout header={<Header />}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          type="error"
          title="Technical work in progress."
          description="Please try again later."
        />
      </Space>
    </PageLayout>
  );
};
