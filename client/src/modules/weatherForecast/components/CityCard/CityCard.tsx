import { Button, Flex } from 'antd';
import { getWeatherBackground, getNextDays } from '../../utils';
import { CloseOutlined } from '@ant-design/icons';
import { BackgroundCard } from '@/modules/common/components/Card/BackgroundCard';
import type { City } from '../../../common/types';
import Title from 'antd/es/typography/Title';
import { AppText } from '../../../common/components/Typography/Text/AppText';

export interface CityCardProps {
  city: string;
  weather: City['weather'];
  onRemove: () => void;
  loading?: boolean;
}

export const CityCard = ({
  city,
  weather,
  onRemove,
  loading,
}: CityCardProps) => {
  const background = getWeatherBackground(weather?.description);

  const days = getNextDays(4);

  return (
    <BackgroundCard
      headerLeft={
        <Title level={5} style={{ margin: 0 }}>
          {city}
        </Title>
      }
      headerRight={
        <Button
          type="text"
          loading={loading}
          onClick={onRemove}
          icon={<CloseOutlined />}
        />
      }
      backgroundImage={background}
    >
      {weather ? (
        <Flex vertical gap={4}>
          <Flex vertical gap={8}>
            <Flex vertical align="center" gap={2}>
              <AppText strong size="lg">
                {weather.temperature}°C
              </AppText>

              <AppText>{weather.description}</AppText>
            </Flex>
            <Flex justify="flex-start">
              <AppText strong>Next days</AppText>
            </Flex>
          </Flex>

          <Flex vertical gap={4} style={{ width: '100%' }}>
            {weather.next3DaysTemperature?.map((t, i) => (
              <Flex
                key={i}
                justify="space-between"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <AppText size="sm">{days[i + 1]?.label}</AppText>
                <AppText size="sm">
                  {weather.next3DaysDescription?.[i]} {t}°C
                </AppText>
              </Flex>
            ))}
          </Flex>
        </Flex>
      ) : (
        <Flex align="center" justify="center">
          <AppText>No forecast yet</AppText>
        </Flex>
      )}
    </BackgroundCard>
  );
};
