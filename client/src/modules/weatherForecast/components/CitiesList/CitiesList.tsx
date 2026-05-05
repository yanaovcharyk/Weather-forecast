import { Col, Row } from 'antd';
import React, { useEffect, useRef } from 'react';
import { CityCard } from '../CityCard/CityCard';
import type { City } from '../../../common/types';

type Props = {
  cities: City[];
  removingCityId: number | null;
  onRemove: (id: number, city: string) => void;
  onCityClick?: (id: number) => void;
  loadMore: () => void;
  hasNext: boolean;
};

export const CitiesList = React.memo(function CitiesList({
  cities,
  removingCityId,
  onRemove,
  onCityClick,
  loadMore,
  hasNext,
}: Props) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNext) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore?.();
      }
    });

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [hasNext, loadMore]);

  return (
    <>
      <Row gutter={[12, 12]}>
        {cities.map((city) => (
          <Col key={city.id} xs={24} sm={24} md={12}>
            <CityCard
              city={city.city}
              weather={city.weather}
              onRemove={() => onRemove(city.id, city.city)}
              loading={removingCityId === city.id}
              onClick={() => onCityClick?.(city.id)}
            />
          </Col>
        ))}
      </Row>

      <div ref={loaderRef} style={{ height: 20 }} />
    </>
  );
});
