import React from 'react';
import { Button, Flex } from 'antd';
import { CloseOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';

import { BackgroundCard, BackgroundCardSkeleton } from '@/common/components';
import { AppText, AppTitle } from '@/common/components/Typography';
import { useSmartBackground } from '@/common/hooks';
import { getWeatherBackground, getNextDays } from '@/weather/utils';
import type { City } from '@/weather/types';

import styles from './CityCard.module.scss';

export interface CityCardProps {
  city: City;
  loading?: boolean;
  onTogglePinned: (id: string, isPinned: boolean) => void;
  onRemove: (id: string) => void;
  onOpen: (id: string) => void;
}

export const CityCard = React.memo(function CityCard({
  city,
  loading,
  onTogglePinned,
  onRemove,
  onOpen,
}: CityCardProps) {
  const { id, cityName, weather, isPinned } = city;

  const background = getWeatherBackground(weather?.description);
  const { loaded } = useSmartBackground(background);

  const isDisabled = !!loading;
  const days = getNextDays(3);

  if (!loaded) {
    return (
      <BackgroundCardSkeleton hasHeader hasExtra rows={4} showBackground />
    );
  }

  return (
    <BackgroundCard
      className={`${styles.card} ${isDisabled ? styles.cardLoading : ''}`}
      onClick={isDisabled ? undefined : () => onOpen(id)}
      headerLeft={<AppTitle level={5}>{cityName}</AppTitle>}
      headerRight={
        <Flex gap={4}>
          <Button
            type="text"
            icon={isPinned ? <HeartFilled /> : <HeartOutlined />}
            onClick={(e) => {
              e.stopPropagation();

              if (isDisabled) {
                return;
              }

              onTogglePinned(id, isPinned);
            }}
          />

          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={(e) => {
              e.stopPropagation();

              if (isDisabled) {
                return;
              }

              onRemove(id);
            }}
          />
        </Flex>
      }
      backgroundImage={background}
    >
      {weather ? (
        <Flex vertical gap={4}>
          <Flex vertical gap={8}>
            <Flex align="center">
              <Flex flex={1}>
                <div />
              </Flex>

              <Flex flex={1} vertical align="center" gap={2}>
                <AppText strong size="lg">
                  {weather.temperature}°C
                </AppText>

                <AppText>{weather.description}</AppText>
              </Flex>

              <Flex flex={1} vertical align="end" gap={6}>
                <AppText size="sm">Max: {weather.max}°C</AppText>

                <AppText size="sm">Min: {weather.min}°C</AppText>
              </Flex>
            </Flex>

            <Flex justify="flex-start">
              <AppText strong>Next days</AppText>
            </Flex>
          </Flex>

          <Flex gap={4} className={styles.forecastDays}>
            {weather.next3Days?.map((day, index) => (
              <Flex
                key={index}
                vertical
                align="center"
                justify="center"
                className={styles.dayCard}
              >
                <AppText size="sm" strong>
                  {days[index]?.label}
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
