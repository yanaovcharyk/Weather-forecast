import { Card, Typography, Flex } from 'antd';
import type { HourlyWeather } from '../../types';

import styles from './HourlyForecast.module.scss';

const { Text } = Typography;

type Props = {
  hourly: HourlyWeather[];
};

export const HourlyForecast = ({ hourly }: Props) => {
  return (
    <Card title="Hourly forecast" className={styles.card}>
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
              <Text strong className={styles.time}>
                {h.time}
              </Text>

              <img
                src={`https://openweathermap.org/img/wn/${h.icon}.png`}
                alt=""
                className={styles.icon}
              />

              <Text className={styles.temp}>{Math.round(h.temp)}°C</Text>

              <Text className={styles.feels}>
                Feels {Math.round(h.feelsLike)}°C
              </Text>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Card>
  );
};
