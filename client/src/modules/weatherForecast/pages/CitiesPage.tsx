import { Spin, Row, Col, Space, Grid, Flex } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { useRemoveCity, useAddCity, useCities } from '../hooks';
import { AddCityForm, CityCard } from '../components';
import type { City } from '@/shared/types';

import { PageLayout, FormCard, Title, Text } from '@/shared/components';
import { handleResult } from '@/shared/utils';
import { TextButton } from '../../../shared/components/Button/TextButton';

export const CitiesPage = () => {
  const { data, loading } = useCities();
  const { addCity, loading: addCityLoading } = useAddCity();
  const { removeCity } = useRemoveCity();

  const [removingId, setRemovingId] = useState<number | null>(null);

  const cities: City[] = data?.cities ?? [];

  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  if (loading && !data) {
    return <Spin fullscreen />;
  }

  const handleAddCity = async (city: string) => {
    const result = await addCity(city);

    handleResult(result, {
      successMessage: 'City added successfully',
    });
  };

  const handleRemove = async (id: number) => {
    setRemovingId(id);

    try {
      await removeCity(id);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <PageLayout
      header={
        <Flex align="center" justify="space-between" style={{ height: '100%' }}>
          <Title
            level={3}
            style={{ margin: 0, textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' }}
          >
            Weather
          </Title>

          <TextButton
            style={{
              width: 32,
              height: 32,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}
          >
            <EllipsisOutlined style={{ fontSize: 18, color: '#234C75' }} />
          </TextButton>
        </Flex>
      }
      footer={
        isMobile && (
          <FormCard fullWidth style={{ padding: '8px 24px 16px' }}>
            <AddCityForm
              onSubmit={handleAddCity}
              disabled={cities.length >= 10 || addCityLoading}
            />
          </FormCard>
        )
      }
    >
      <Row justify="center">
        <Col span={24}>
          <Space orientation="vertical" size="small" style={{ width: '100%' }}>
            {!isMobile && (
              <Row justify="center">
                <Col span={24}>
                  <FormCard fullWidth>
                    <AddCityForm
                      onSubmit={handleAddCity}
                      disabled={cities.length >= 10 || addCityLoading}
                    />
                  </FormCard>
                </Col>
              </Row>
            )}

            {cities.length === 0 ? (
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">No cities yet 🌥</Text>
              </div>
            ) : (
              <Row gutter={[12, 12]}>
                {cities.map((city) => (
                  <Col key={city.id} xs={24} sm={24} md={12} lg={8} xl={6}>
                    <CityCard
                      city={city.city}
                      weather={city.weather}
                      onRemove={() => handleRemove(city.id)}
                      loading={removingId === city.id}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Space>
        </Col>
      </Row>
    </PageLayout>
  );
};
