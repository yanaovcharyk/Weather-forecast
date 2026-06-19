import { Card, Flex } from 'antd';
import type { HourlyWeather } from '../../types';
import styles from './HourlyForecast.module.scss';
import { AppText } from '../../../common/components/Typography';

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
              <AppText strong className={styles.time}>
                {h.time}
              </AppText>

              <img
                src={`https://openweathermap.org/img/wn/${h.icon}.png`}
                alt={`Weather at ${h.time}`}
                className={styles.icon}
              />

              <AppText className={styles.temp}>{Math.round(h.temp)}°C</AppText>

              <AppText className={styles.feels}>
                Feels {Math.round(h.feelsLike)}°C
              </AppText>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Card>
  );
};
