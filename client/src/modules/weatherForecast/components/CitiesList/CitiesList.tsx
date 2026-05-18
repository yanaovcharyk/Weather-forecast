import { Col, Row, Spin } from 'antd';
import React, { useEffect, useRef } from 'react';
import { CityCard } from '../CityCard';
import type { City } from '@/common/types';
import styles from './CitiesList.module.scss';

type Props = {
  cities: City[];
  removingCityId: string | null;
  onRemove: (id: string, city: string) => void;
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
}: Props) {
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

    if (el) {
      observerRef.current.observe(el);
    }

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
              city={city.city}
              weather={city.weather}
              isPinned={city.isPinned}
              onTogglePinned={() => onTogglePinned(city.id, city.isPinned)}
              onRemove={() => onRemove(city.id, city.city)}
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
