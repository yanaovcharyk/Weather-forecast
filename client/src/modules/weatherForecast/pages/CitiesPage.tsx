import { Spin, Row, Col, Space } from 'antd';
import { useCallback, useState } from 'react';

import { useRemoveCity, useAddCity, useCities } from '../hooks';
import { AddCityForm, CitiesList } from '../components';

import { CityService } from '../services/CityService';
import { useIsMobile } from '@/modules/common/hooks';
import { EmptyState, FormCard, PageLayout } from '@/modules/common/components';
import { Header } from '@/modules/common/components';
import { handleResult } from '../../common/utils';

export const CitiesPage = () => {
  const { data, loading } = useCities();
  const { addCity, loading: addCityLoading } = useAddCity();
  const { removeCity } = useRemoveCity();

  const [removingId, setRemovingId] = useState<number | null>(null);

  const cities = data?.cities ?? [];
  const isMobile = useIsMobile();

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

  const addCityForm = (
    <AddCityForm onSubmit={handleAddCity} disabled={isAddDisabled} />
  );

  if (loading && !data) {
    return <Spin fullscreen />;
  }

  return (
    <PageLayout
      header={<Header />}
      footer={isMobile && <FormCard fullWidth>{addCityForm}</FormCard>}
    >
      <Row justify="center">
        <Col span={24}>
          <Space orientation="vertical" size="small" style={{ width: '100%' }}>
            {!isMobile && (
              <Row justify="center">
                <Col span={24}>
                  <FormCard fullWidth>{addCityForm}</FormCard>
                </Col>
              </Row>
            )}

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
