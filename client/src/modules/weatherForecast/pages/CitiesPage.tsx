import { Spin, Row, Col, Space } from 'antd';
import { useCallback, useState } from 'react';

import { useRemoveCity, useAddCity, useCities } from '../hooks';
import { AddCityForm, CitiesList } from '../components';
import { EmptyState, FormCard, PageLayout, Header } from '@/common/components';
import { handleResult } from '@/common/utils';
import { useNavigate } from 'react-router-dom';

export const CitiesPage = () => {
  const { data, loading } = useCities();
  const { addCity, loading: addCityLoading } = useAddCity();
  const { removeCity } = useRemoveCity();

  const [removingId, setRemovingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const cities = data?.cities ?? [];

  // const isCityLimitReached = CityService.isCityLimitReached(cities);
  const isAddDisabled = addCityLoading;

  const handleAddCity = useCallback(
    async (lat: number, lon: number, city: string) => {
      const result = await addCity(lat, lon, city);

      handleResult(result, {
        successMessage: `City ${city} added successfully`,
      });
    },
    [addCity],
  );

  const handleRemove = useCallback(
    async (id: number, city: string) => {
      setRemovingId(id);

      try {
        await removeCity(id);
        handleResult(
          { ok: true },
          { successMessage: `City ${city} removed successfully` },
        );
      } finally {
        setRemovingId(null);
      }
    },
    [removeCity],
  );

  const handleOpenCity = useCallback(
    (id: number) => {
      navigate(`/cities/${id}`);
    },
    [navigate],
  );

  if (loading && !data) {
    return <Spin fullscreen />;
  }

  return (
    <PageLayout header={<Header />}>
      <Row justify="center">
        <Col span={24}>
          <Space orientation="vertical" size="medium" style={{ width: '100%' }}>
            <FormCard>
              <AddCityForm onSubmit={handleAddCity} disabled={isAddDisabled} />
            </FormCard>

            {cities.length === 0 ? (
              <EmptyState description="No cities added" />
            ) : (
              <CitiesList
                cities={cities}
                removingCityId={removingId}
                onRemove={handleRemove}
                onCityClick={handleOpenCity}
              />
            )}
          </Space>
        </Col>
      </Row>
    </PageLayout>
  );
};
