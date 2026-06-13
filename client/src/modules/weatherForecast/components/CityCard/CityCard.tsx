import React from 'react';
import { Button, Flex } from 'antd';
import { getWeatherBackground, getNextDays } from '@/weatherForecast/utils';
import { CloseOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { BackgroundCard, BackgroundCardSkeleton } from '@/common/components';
import { AppText, AppTitle } from '@/common/components/Typography';
import { useSmartBackground } from '@/common/hooks';
import styles from './CityCard.module.scss';
import type { City } from '../../types';

export interface CityCardProps {
  city: string;
  weather: City['weather'];
  isPinned: boolean;
  onTogglePinned: () => void;
  onRemove: () => void;
  loading?: boolean;
  onClick?: () => void;
}

export const CityCard = React.memo(function CityCard({
  city,
  weather,
  isPinned,
  onTogglePinned,
  onRemove,
  loading,
  onClick,
}: CityCardProps) {
  const background = getWeatherBackground(weather?.description);

  const { loaded } = useSmartBackground(background);

  const isDisabled = loading;

  const days = getNextDays(3);

  if (!loaded) {
    return (
      <BackgroundCardSkeleton hasHeader hasExtra rows={4} showBackground />
    );
  }

  return (
    <BackgroundCard
      className={`${styles.card} ${isDisabled ? styles.cardLoading : ''}`}
      onClick={isDisabled ? undefined : onClick}
      headerLeft={<AppTitle level={5}>{city}</AppTitle>}
      headerRight={
        <Flex gap={4}>
          <Button
            type="text"
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();

              if (isDisabled) {
                return;
              }

              onTogglePinned();
            }}
            icon={
              isPinned ? (
                <HeartFilled style={{ color: 'red' }} />
              ) : (
                <HeartOutlined />
              )
            }
          />

          <Button
            type="text"
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();

              if (isDisabled) {
                return;
              }

              onRemove();
            }}
            icon={<CloseOutlined />}
          />
        </Flex>
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

          <Flex gap={4} style={{ width: '100%' }}>
            {weather.next3Days?.map((day, i) => (
              <Flex
                key={i}
                vertical
                align="center"
                justify="center"
                className={styles.dayCard}
                style={{ flex: 1 }}
              >
                <AppText size="sm" strong>
                  {days[i]?.label}
                </AppText>

                <AppText strong>
                  {day.min}° / {day.max}°C
                </AppText>

                <AppText size="sm">{day.description}</AppText>
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
