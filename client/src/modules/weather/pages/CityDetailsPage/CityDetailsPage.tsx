import { Space } from 'antd';
import { PageLayout, Header } from '@/common/components';
import {
  CurrentWeatherCard,
  HourlyForecast,
  DailyForecast,
} from '@/weather/components';
import styles from './CityDetailsPage.module.scss';
import { BackToAllCitiesButton } from '@/weather/components';

export const CityDetailsPage = () => {
  return (
    <PageLayout header={<Header />}>
      <Space orientation="vertical" size="large" className={styles.container}>
        <BackToAllCitiesButton />

        <Space orientation="vertical" size="large" className={styles.container}>
          <CurrentWeatherCard />
          <HourlyForecast />
          <DailyForecast />
        </Space>
      </Space>
    </PageLayout>
  );
};
