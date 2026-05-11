import { Space, Alert, Button } from 'antd';
import { PageLayout, Header, AppCard } from '@/common/components';

import { useCityWeather } from '../hooks/useCityWeather';
import { CurrentWeatherCard } from '../components/CurrentWeatherCard/CurrentWeatherCard';
import { HourlyForecast } from '../components/HourlyForecast/HourlyForecast';
import { DailyForecast } from '../components/DailyForecast/DailyForecast';
import { useNavigate } from 'react-router';
import { BlurLoaderOverlay } from '../../common/components/BlurLoaderOverlay/BlurLoaderOverlay';

export const CityDetailsPage = () => {
  const { city, weather, loading, error } = useCityWeather();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
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
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <AppCard>
          <Button type="default" onClick={handleBack}>
            ← Back to all cities
          </Button>
        </AppCard>

        <BlurLoaderOverlay loading={loading || !weather || !city}>
          {city && weather && (
            <>
              <CurrentWeatherCard city={city} weather={weather} />
              <HourlyForecast hourly={weather.hourly} />
              <DailyForecast daily={weather.daily} />
            </>
          )}
        </BlurLoaderOverlay>
      </Space>
    </PageLayout>
  );
};
