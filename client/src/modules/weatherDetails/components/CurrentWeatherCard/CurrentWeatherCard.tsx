import { Col, Flex, Row, theme } from 'antd';
import type { WeatherDetails } from '../../types';
import { InfoGrid } from '../InfoGrid/InfoGrid';
import { BackgroundCard } from '../../../common/components';
import { getWeatherBackground } from '../../../weatherForecast/utils';
import { AppTitle } from '../../../common/components/Typography/Title/AppTitle';
import { AppText } from '../../../common/components/Typography/Text/AppText';

import styles from './CurrentWeatherCard.module.scss';

type Props = {
  city: string;
  weather: WeatherDetails;
};

export const CurrentWeatherCard = ({ city, weather }: Props) => {
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
              {city}
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
            ]}
          />
        </Col>
      </Row>
    </BackgroundCard>
  );
};
