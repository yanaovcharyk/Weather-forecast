import { Card, Flex } from 'antd';
import styles from './HourlyForecast.module.scss';
import { AppText } from '@/common/components/Typography';
import { DataBoundary } from '@/common/components';
import { useCityWeather } from '@/weather/hooks';

export const HourlyForecast = () => {
  const { weather, weatherLoading, error } = useCityWeather();
  const hourly = weather?.hourly ?? [];
  const isInitialLoading = weatherLoading && hourly.length === 0;

  return (
    <DataBoundary
      error={error}
      errorTitle="Failed to load hourly forecast"
      showLoadingOverlay={false}
    >
      <Card
        title="Hourly forecast"
        className={styles.card}
        loading={isInitialLoading}
      >
        <Flex gap={12} className={styles.scrollRow}>
          {hourly.map((h, index) => (
            <Card
              key={`${h.time}-${index}`}
              size="small"
              className={styles.hourCard}
              styles={{
                body: { padding: 10 },
              }}
            >
              <Flex vertical align="center" gap={6} className={styles.content}>
                <AppText strong className={styles.time}>
                  {h.time}
                </AppText>

                <img
                  src={h.iconUrl}
                  alt={`Weather at ${h.time}`}
                  className={styles.icon}
                />

                <AppText className={styles.temp}>
                  {Math.round(h.temp)}°C
                </AppText>

                <AppText className={styles.feels}>
                  Feels {Math.round(h.feelsLike)}°C
                </AppText>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Card>
    </DataBoundary>
  );
};
