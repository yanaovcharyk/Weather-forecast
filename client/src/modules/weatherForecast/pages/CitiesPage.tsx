import { Spin, Row, Col, Space } from 'antd';
import { useCallback, useState } from 'react';

import { useRemoveCity, useAddCity, useCities } from '../hooks';
import { AddCityForm, CitiesList } from '../components';

import { CityService } from '../services/CityService';
import { EmptyState, FormCard, PageLayout } from '@/modules/common/components';
import { Header } from '@/modules/common/components';
import { handleResult } from '../../common/utils';

export const CitiesPage = () => {
  const { data, loading } = useCities();
  const { addCity, loading: addCityLoading } = useAddCity();
  const { removeCity } = useRemoveCity();

  const [removingId, setRemovingId] = useState<number | null>(null);

  const cities = data?.cities ?? [];

  const isCityLimitReached = CityService.isCityLimitReached(cities);
  const isAddDisabled = isCityLimitReached || addCityLoading;

  const handleAddCity = useCallback(
    async (city: string) => {
      const result = await addCity(city);

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

  if (loading && !data) {
    return <Spin fullscreen />;
  }

  return (
    <PageLayout header={<Header />}>
      <Row justify="center">
        <Col span={24}>
          <Space orientation="vertical" size="medium">
            <FormCard fullWidth>
              <AddCityForm onSubmit={handleAddCity} disabled={isAddDisabled} />
            </FormCard>

            {cities.length === 0 ? (
              <EmptyState />
            ) : (
              <CitiesList
                cities={cities}
                removingCityId={removingId}
                onRemove={handleRemove}
              />
            )}
          </Space>
        </Col>
      </Row>
    </PageLayout>
  );
};
