import { Card, Flex, theme } from 'antd';
import type { DailyWeather } from '@/weatherDetails/types';
import { AppText } from '@/common/components/Typography';
import styles from './DailyForecast.module.scss';
type Props = {
  daily: DailyWeather[];
};

const getWeekday = (dateStr: string) => {
  const day = new Date(dateStr);
  return day.toLocaleDateString('en-US', { weekday: 'short' });
};

export const DailyForecast = ({ daily }: Props) => {
  const { token } = theme.useToken();

  return (
    <Card
      title="3-day forecast"
      className={styles.card}
      classNames={{
        header: styles.cardHead,
      }}
      styles={{
        body: { padding: token.padding },
      }}
    >
      <Flex gap={16} className={styles.container}>
        {daily.slice(0, 3).map((day) => (
          <Card
            key={day.date}
            size="small"
            className={styles.dayCard}
            style={{ borderRadius: token.borderRadius }}
            styles={{
              body: { padding: 14 },
            }}
          >
            <Flex vertical align="center" gap={8} className={styles.content}>
              <AppText strong className={styles.title}>
                {getWeekday(day.date)}
              </AppText>

              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.description}
                className={styles.icon}
              />

              <AppText strong className={styles.temp}>
                {Math.round(day.min)}° / {Math.round(day.max)}°
              </AppText>

              <AppText className={styles.description}>
                {day.description}
              </AppText>

              <AppText className={styles.meta}>
                Humidity: {day.humidity}%
              </AppText>

              <AppText className={styles.meta}>
                Wind: {day.windSpeed} m/s
              </AppText>

              <AppText className={styles.meta}>Rain: {day.pop}%</AppText>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Card>
  );
};
