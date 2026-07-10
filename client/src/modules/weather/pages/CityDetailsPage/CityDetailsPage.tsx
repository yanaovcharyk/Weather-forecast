import { Space } from 'antd';
import { useCityWeather } from '@/weather/hooks';
import { PageLayout, Header } from '@/common/components';
import {
  CurrentWeatherCard,
  HourlyForecast,
  DailyForecast,
} from '@/weather/components';
import styles from './CityDetailsPage.module.scss';
import { BackToAllCitiesButton } from '@/weather/components';
import { DataBoundary } from '@/common/components';

export const CityDetailsPage = () => {
  const { cityName, weather, loading, error } = useCityWeather();

  const isLoading = loading || !cityName || !weather;

  return (
    <DataBoundary
      loading={isLoading}
      error={error}
      errorTitle="Failed to load weather data"
    >
      {cityName && weather && (
        <PageLayout header={<Header />}>
          <Space
            orientation="vertical"
            size="large"
            className={styles.container}
          >
            <BackToAllCitiesButton />

            <Space
              orientation="vertical"
              size="large"
              className={styles.container}
            >
              <CurrentWeatherCard cityName={cityName} weather={weather} />
              <HourlyForecast hourly={weather.hourly} />
              <DailyForecast daily={weather.daily} />
            </Space>
          </Space>
        </PageLayout>
      )}
    </DataBoundary>
  );
};
