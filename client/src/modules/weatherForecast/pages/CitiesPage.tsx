import { Spin, Row, Col, Space, App } from 'antd';
import { useCallback, useState } from 'react';

import { useRemoveCity, useAddCity } from '../hooks';
import { useCitiesPaginated } from '../hooks/useCitiesPaginated';
import { useRemoveAllCities } from '../hooks/useRemoveAllCities';

import { AddCityForm, CitiesList } from '../components';

import { EmptyState, FormCard, PageLayout, Header } from '@/common/components';

import { ScrollToTopButton } from '../../common/components/ScrollToTopButton';

import { handleResult } from '@/common/utils';
import { useNavigate } from 'react-router-dom';
import { CitiesControls } from '../components/CitiesControlBar/CitiesControls';

type SortingState = {
  sortBy: 'createdAt' | 'city';
  sortOrder: 'ASC' | 'DESC';
};

export const CitiesPage = () => {
  const [sorting, setSorting] = useState<SortingState>({
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const { message } = App.useApp();

  const { cities, loading, loadMore, hasNext } = useCitiesPaginated(sorting);

  const loadMoreStable = useCallback(() => loadMore(), [loadMore]);

  const { addCity } = useAddCity();
  const { removeCity } = useRemoveCity();
  const { removeAllCities } = useRemoveAllCities();

  const [removingId, setRemovingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const notifyError = useCallback(
    (msg: string) => message.error(msg),
    [message],
  );

  const notifySuccess = useCallback(
    (msg: string) => message.success(msg),
    [message],
  );

  const handleAddCity = useCallback(
    async (lat: number, lon: number, city: string) => {
      const result = await addCity(lat, lon, city);

      handleResult(result, {
        successMessage: `City ${city} added successfully`,
        notifyError,
        notifySuccess,
      });
    },
    [addCity, notifyError, notifySuccess],
  );

  const handleRemove = useCallback(
    async (id: number, city: string) => {
      setRemovingId(id);

      try {
        await removeCity(id);

        handleResult(
          { ok: true },
          {
            successMessage: `City ${city} removed successfully`,
            notifyError,
            notifySuccess,
          },
        );
      } finally {
        setRemovingId(null);
      }
    },
    [removeCity, notifyError, notifySuccess],
  );

  const handleOpenCity = useCallback(
    (id: number) => {
      navigate(`/cities/${id}`);
    },
    [navigate],
  );

  const handleDeleteAll = useCallback(async () => {
    const result = await removeAllCities();

    handleResult(result, {
      successMessage: 'All cities removed successfully',
      notifyError,
      notifySuccess,
    });
  }, [removeAllCities, notifyError, notifySuccess]);

  if (loading && cities.length === 0) {
    return <Spin fullscreen />;
  }

  return (
    <PageLayout header={<Header />}>
      <Row justify="center">
        <Col span={24}>
          <Space orientation="vertical" style={{ width: '100%' }}>
            <FormCard>
              <AddCityForm onSubmit={handleAddCity} />
            </FormCard>

            <FormCard>
              <CitiesControls
                sorting={sorting}
                setSorting={setSorting}
                onDeleteAll={handleDeleteAll}
              />
            </FormCard>

            {cities.length === 0 ? (
              <EmptyState description="No cities" />
            ) : (
              <CitiesList
                cities={cities}
                removingCityId={removingId}
                onRemove={handleRemove}
                loadMore={loadMoreStable}
                hasNext={hasNext}
                onCityClick={handleOpenCity}
              />
            )}
          </Space>
        </Col>
      </Row>

      <ScrollToTopButton />
    </PageLayout>
  );
};
