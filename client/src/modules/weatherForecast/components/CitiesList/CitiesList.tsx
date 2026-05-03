import { Row, Col } from 'antd';
import type { City } from '@/common/types';
import { CityCard } from '../CityCard/CityCard';

interface CitiesListProps {
  cities: City[];
  removingCityId: number | null;
  onRemove: (id: number, name: string) => void;
  onCityClick?: (id: number) => void;
}

export const CitiesList = ({
  cities,
  removingCityId,
  onRemove,
  onCityClick,
}: CitiesListProps) => (
  <Row gutter={[12, 12]}>
    {cities.map((city) => (
      <Col key={city.id} xs={24} sm={24} md={12} lg={12} xl={12}>
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
);
