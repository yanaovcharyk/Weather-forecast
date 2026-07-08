import { Space, Alert, Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router';
import { useCityWeather } from '@/weather/hooks';
import {
  PageLayout,
  Header,
  AppCard,
  BlurLoaderOverlay,
} from '@/common/components';
import {
  CurrentWeatherCard,
  HourlyForecast,
  DailyForecast,
} from '@/weather/components';
import styles from './CityDetailsPage.module.scss';

export const CityDetailsPage = () => {
  const { cityName, weather, loading, error } = useCityWeather();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleBack = () => {
    navigate(`/?${params.toString()}`);
  };

  if (error) {
    return (
      <PageLayout header={<Header />}>
        <Alert
          type="error"
          title="Failed to load weather data"
          description={error.message}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout header={<Header />}>
      <Space orientation="vertical" size="large" className={styles.container}>
        <AppCard>
          <Button type="default" onClick={handleBack}>
            ← Back to all cities
          </Button>
        </AppCard>

        <BlurLoaderOverlay loading={loading || !weather || !cityName}>
          {cityName && weather && (
            <Space
              orientation="vertical"
              size="large"
              className={styles.container}
            >
              <CurrentWeatherCard cityName={cityName} weather={weather} />
              <HourlyForecast hourly={weather.hourly} />
              <DailyForecast daily={weather.daily} />
            </Space>
          )}
        </BlurLoaderOverlay>
      </Space>
    </PageLayout>
  );
};
