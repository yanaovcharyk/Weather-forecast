import { Col, Flex, Row, theme } from 'antd';
import type { WeatherDetails } from '@/weather/types';
import { InfoGrid } from '@/weather/components/InfoGrid';
import { BackgroundCard } from '@/common/components';
import { getWeatherBackground } from '@/weather/utils';
import { AppTitle, AppText } from '@/common/components/Typography';
import styles from './CurrentWeatherCard.module.scss';

type CurrentWeatherCardProps = {
  cityName: string;
  weather: WeatherDetails;
};

export const CurrentWeatherCard = ({
  cityName,
  weather,
}: CurrentWeatherCardProps) => {
  const { token } = theme.useToken();
  const { current } = weather;
  const background = getWeatherBackground(weather?.current?.description);

  return (
    <BackgroundCard backgroundImage={background}>
      <Row gutter={[16, 16]} className={styles.wrapper}>
        <Col span={12}>
          <Flex
            vertical
            align="flex-start"
            justify="center"
            className={styles.leftBlock}
          >
            <AppTitle
              level={3}
              className={styles.cityTitle}
              style={{ color: token.colorText }}
            >
              {cityName}
              <img
                src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
                alt={current.description}
                className={styles.iconSmall}
              />
            </AppTitle>

            <AppText
              type="secondary"
              className={styles.description}
              style={{ fontSize: token.fontSize }}
            >
              {current.description}
            </AppText>
          </Flex>
        </Col>

        <Col span={12}>
          <Flex
            vertical
            align="flex-end"
            justify="center"
            className={styles.rightBlock}
          >
            <AppTitle
              level={2}
              className={styles.temperature}
              style={{ color: token.colorText }}
            >
              {current.temp}°C
            </AppTitle>
          </Flex>
        </Col>

        <Col span={12}>
          <InfoGrid
            column={1}
            items={[
              { label: 'Feels like', value: `${current.feelsLike}°C` },
              { label: 'Humidity', value: `${current.humidity}%` },
              { label: 'Wind', value: `${current.windSpeed} m/s` },
              { label: 'Min', value: `${current.min}°C` },
            ]}
          />
        </Col>

        <Col span={12}>
          <InfoGrid
            column={1}
            items={[
              { label: 'Pressure', value: `${current.pressure} hPa` },
              { label: 'Sunrise', value: current.sunrise },
              { label: 'Sunset', value: current.sunset },
              { label: 'Max', value: `${current.max}°C` },
            ]}
          />
        </Col>
      </Row>
    </BackgroundCard>
  );
};
