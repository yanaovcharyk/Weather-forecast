import { Col, Row, Spin } from 'antd';
import React, { useEffect, useRef } from 'react';
import { CityCard } from '@/weatherForecast/components/CityCard';
import styles from './CitiesList.module.scss';
import type { City } from '@/weatherForecast/types';

export type CitiesListProps = {
  cities: City[];
  removingCityId: string | null;
  onRemove: (id: string, cityName: string) => void;
  onTogglePinned: (id: string, currentPinned: boolean) => void;
  onCityClick?: (id: string) => void;
  loadMore: () => void;
  hasNext: boolean;
  loading?: boolean;
};

export const CitiesList = React.memo(function CitiesList({
  cities,
  removingCityId,
  onRemove,
  onTogglePinned,
  onCityClick,
  loadMore,
  hasNext,
  loading,
}: CitiesListProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!hasNext) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        loadMore();
      }
    });

    const el = loaderRef.current;

    /* istanbul ignore next */
    if (!el) return;

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasNext, loadMore, cities.length]);

  return (
    <div className={styles.wrapper}>
      <Row gutter={[12, 12]} className={loading ? styles.blocked : undefined}>
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

      {hasNext && <div ref={loaderRef} className={styles.hasNext} />}

      {loading && (
        <div className={styles.overlay}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
});
