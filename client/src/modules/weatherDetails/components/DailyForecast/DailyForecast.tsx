import { Card, Typography, Flex, theme } from 'antd';
import type { DailyWeather } from '../../types';

import styles from './DailyForecast.module.scss';

const { Text } = Typography;

type Props = {
  daily: DailyWeather[];
};

const getWeekday = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
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
        {daily.slice(0, 3).map((d) => (
          <Card
            key={d.date}
            size="small"
            className={styles.dayCard}
            style={{ borderRadius: token.borderRadius }}
            styles={{
              body: { padding: 14 },
            }}
          >
            <Flex vertical align="center" gap={8} className={styles.content}>
              <Text strong className={styles.title}>
                {getWeekday(d.date)}
              </Text>

              <img
                src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                alt={d.description}
                className={styles.icon}
              />

              <Text strong className={styles.temp}>
                {Math.round(d.min)}° / {Math.round(d.max)}°
              </Text>

              <Text className={styles.description}>{d.description}</Text>

              <Text className={styles.meta}>Humidity: {d.humidity}%</Text>

              <Text className={styles.meta}>Wind: {d.windSpeed} m/s</Text>

              <Text className={styles.meta}>Rain: {d.pop}%</Text>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Card>
  );
};
