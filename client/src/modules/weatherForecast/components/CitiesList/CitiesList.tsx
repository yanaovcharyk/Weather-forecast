import { Row, Col } from 'antd';
import type { City } from '@/common/types';
import { CityCard } from '../CityCard/CityCard';

interface CitiesListProps {
  cities: City[];
  removingCityId: number | null;
  onRemove: (id: number, name: string) => void;
}

export const CitiesList = ({
  cities,
  removingCityId,
  onRemove,
}: CitiesListProps) => (
  <Row gutter={[12, 12]}>
    {cities.map((city) => (
      <Col key={city.id} xs={24} sm={24} md={12} lg={8} xl={6}>
        <CityCard
          city={city.city}
          weather={city.weather}
          onRemove={() => onRemove(city.id, city.city)}
          loading={removingCityId === city.id}
        />
      </Col>
    ))}
  </Row>
);
