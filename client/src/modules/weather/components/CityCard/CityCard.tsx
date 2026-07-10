import React, { useCallback, useState } from 'react';
import { Button, Flex } from 'antd';
import { CloseOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BackgroundCard, BackgroundCardSkeleton } from '@/common/components';
import { AppText, AppTitle } from '@/common/components/Typography';
import { useSmartBackground } from '@/common/hooks';
import { useRemoveCity, useTogglePinned } from '@/weather/hooks';
import { getWeatherBackground, getNextDays } from '@/weather/utils';
import type { City } from '@/weather/types';

import styles from './CityCard.module.scss';

export interface CityCardProps {
  city: City;
}

export const CityCard = React.memo(function CityCard({ city }: CityCardProps) {
  const { id, cityName, weather, isPinned } = city;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { removeCity } = useRemoveCity();
  const { togglePinned } = useTogglePinned();
  const [isRemoving, setIsRemoving] = useState(false);

  const background = getWeatherBackground(weather?.description);
  const { loaded } = useSmartBackground(background);

  const isDisabled = isRemoving;
  const days = getNextDays(3);

  const clearExistingCitySelection = useCallback(() => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete('existingId');
    setSearchParams(updatedParams);
  }, [searchParams, setSearchParams]);

  const handleOpen = useCallback(() => {
    navigate(`/cities/${id}`);
  }, [navigate, id]);

  const handleTogglePinned = useCallback(async () => {
    await togglePinned(id, isPinned);
  }, [togglePinned, id, isPinned]);

  const handleRemove = useCallback(async () => {
    setIsRemoving(true);

    try {
      await removeCity(id);

      if (searchParams.get('existingId') === id) {
        clearExistingCitySelection();
      }
    } finally {
      setIsRemoving(false);
    }
  }, [removeCity, id, searchParams, clearExistingCitySelection]);

  if (!loaded) {
    return (
      <BackgroundCardSkeleton hasHeader hasExtra rows={4} showBackground />
    );
  }

  return (
    <BackgroundCard
      className={`${styles.card} ${isDisabled ? styles.cardLoading : ''}`}
      onClick={isDisabled ? undefined : handleOpen}
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

              void handleTogglePinned();
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

              void handleRemove();
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
