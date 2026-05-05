import { Button, Flex } from 'antd';
import { getWeatherBackground, getNextDays } from '@/weatherForecast/utils';
import { CloseOutlined } from '@ant-design/icons';
import { BackgroundCard, BackgroundCardSkeleton } from '@/common/components';
import type { City } from '@/common/types';
import { AppText } from '@/common/components/Typography/Text/AppText';
import { useSmartBackground } from '@/common/hooks';
import { AppTitle } from '@/common/components/Typography/Title/AppTitle';
import styles from './CityCard.module.scss';
import React from 'react';

export interface CityCardProps {
  city: string;
  weather: City['weather'];
  onRemove: () => void;
  loading?: boolean;
  onClick?: () => void;
}

export const CityCard = React.memo(function CityCard({
  city,
  weather,
  onRemove,
  loading,
  onClick,
}: CityCardProps) {
  const background = getWeatherBackground(weather?.description);
  const { loaded } = useSmartBackground(background);

  const days = getNextDays(4);

  if (!loaded) {
    return (
      <BackgroundCardSkeleton hasHeader hasExtra rows={4} showBackground />
    );
  }

  return (
    <BackgroundCard
      className={styles.card}
      headerLeft={<AppTitle level={5}>{city}</AppTitle>}
      headerRight={
        <Button
          type="text"
          loading={loading}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          icon={<CloseOutlined />}
        />
      }
      backgroundImage={background}
      onClick={onClick}
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

          <Flex gap={4} style={{ width: '100%' }}>
            {weather.next3DaysTemperature?.map((t, i) => (
              <Flex
                key={i}
                vertical
                align="center"
                justify="center"
                className={styles.dayCard}
                style={{ flex: 1 }}
              >
                <AppText size="sm" strong>
                  {days[i + 1]?.label}
                </AppText>

                <AppText strong>{t}°C</AppText>

                <AppText size="sm">{weather.next3DaysDescription?.[i]}</AppText>
              </Flex>
            ))}
          </Flex>
        </Flex>
      ) : (
        <Flex align="center" justify="flex-start">
          <AppText>No forecast yet</AppText>
        </Flex>
      )}
    </BackgroundCard>
  );
});
