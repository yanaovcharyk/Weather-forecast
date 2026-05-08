import { Spin, Space, Alert, Button } from 'antd';
import { PageLayout, Header, FormCard } from '@/common/components';

import { useCityWeather } from '../hooks/useCityWeather';
import { CurrentWeatherCard } from '../components/CurrentWeatherCard/CurrentWeatherCard';
import { HourlyForecast } from '../components/HourlyForecast/HourlyForecast';
import { DailyForecast } from '../components/DailyForecast/DailyForecast';
import { useNavigate } from 'react-router';

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

  if (loading || !weather || !city) {
    return <Spin fullscreen />;
  }

  return (
    <PageLayout header={<Header />}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <FormCard>
          <Button type="default" onClick={handleBack}>
            ← Back to all cities
          </Button>
        </FormCard>
        <CurrentWeatherCard city={city} weather={weather} />
        <HourlyForecast hourly={weather.hourly} />
        <DailyForecast daily={weather.daily} />
      </Space>
    </PageLayout>
  );
};
