import { Col, Row, Spin } from 'antd';
import React from 'react';
import { CityCard } from '@/weather/components/CityCard';
import { useInfiniteScrollTrigger } from '@/weather/hooks/useInfiniteScrollTrigger';
import styles from './CitiesList.module.scss';
import type { City } from '@/weather/types';

export type CitiesListProps = {
  cities: City[];
  removingCityId: string | null;
  onRemove: (id: string, cityName: string) => void;
  onTogglePinned: (id: string, currentPinned: boolean) => void;
  onCityClick?: (id: string) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isListLoading?: boolean;
};

export const CitiesList = React.memo(function CitiesList(
  props: CitiesListProps,
) {
  const {
    cities,
    removingCityId,
    onRemove,
    onTogglePinned,
    onCityClick,
    onLoadMore,
    hasNextPage,
    isListLoading,
  } = props;

  const loadMoreTriggerRef = useInfiniteScrollTrigger({
    hasNextPage,
    onLoadMore,
  });

  return (
    <div className={styles.wrapper}>
      <Row
        gutter={[12, 12]}
        className={isListLoading ? styles.blocked : undefined}
      >
        {cities.map((city) => (
          <Col key={city.id} xs={24} sm={24} md={12}>
            <CityCard
              cityName={city.cityName}
              weather={city.weather}
              isPinned={city.isPinned}
              onTogglePinned={() => onTogglePinned(city.id, city.isPinned)}
              onRemove={() => onRemove(city.id, city.cityName)}
              loading={removingCityId === city.id}
              onClick={() => onCityClick?.(city.id)}
            />
          </Col>
        ))}
      </Row>

      {hasNextPage && (
        <div ref={loadMoreTriggerRef} className={styles.hasNext} />
      )}

      {isListLoading && (
        <div className={styles.overlay}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
});
