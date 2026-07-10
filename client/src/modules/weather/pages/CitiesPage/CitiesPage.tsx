import { Row, Col, Flex } from 'antd';
import { AddCityForm, CitiesList, CitiesControls } from '@/weather/components';
import {
  AppCard,
  PageLayout,
  Header,
  ScrollToTopButton,
} from '@/common/components';
import styles from './CitiesPage.module.scss';

export const CitiesPage = () => {
  return (
    <PageLayout header={<Header />}>
      <Row justify="center">
        <Col span={24}>
          <Flex vertical className={styles.content} gap={16}>
            <AddCityForm />

            <AppCard>
              <CitiesControls />
            </AppCard>

            <CitiesList />
          </Flex>
        </Col>
      </Row>

      <ScrollToTopButton />
    </PageLayout>
  );
};
