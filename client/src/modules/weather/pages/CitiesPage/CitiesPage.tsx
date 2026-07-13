import { Row, Col, Flex } from 'antd';
import { AddCityForm, SavedCities } from '@/weather/components';
import { PageLayout, Header, ScrollToTopButton } from '@/common/components';
import styles from './CitiesPage.module.scss';

export const CitiesPage = () => {
  return (
    <PageLayout header={<Header />}>
      <Row justify="center">
        <Col span={24}>
          <Flex vertical className={styles.content} gap={16}>
            <AddCityForm />
            <SavedCities />
          </Flex>
        </Col>
      </Row>

      <ScrollToTopButton />
    </PageLayout>
  );
};
