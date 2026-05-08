import { Spin, Row, Col, App, Button, Flex } from 'antd';
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
import type { City } from '../../common/types';

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
  const navigate = useNavigate();

  const { cities, loading, loadMore, hasNext } = useCitiesPaginated(sorting);
  const loadMoreStable = useCallback(() => loadMore(), [loadMore]);

  const { addCity } = useAddCity();
  const { removeCity } = useRemoveCity();
  const { removeAllCities } = useRemoveAllCities();

  const [removingId, setRemovingId] = useState<number | null>(null);
  const [existingCity, setExistingCity] = useState<City | null>(null);

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

      if (!result.ok && result.code === 'CITY_EXISTS') {
        setExistingCity(result.existingCity);
        message.info(`City ${city} already exists`);
        return;
      }

      handleResult(
        { ok: result.ok, code: result.code ?? undefined },
        {
          successMessage: `City ${city} added successfully`,
          notifyError,
          notifySuccess,
        },
      );
    },
    [message, addCity, notifyError, notifySuccess],
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
    (id: number) => navigate(`/cities/${id}`),
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

  const handleBack = () => setExistingCity(null);

  if (loading && cities.length === 0) {
    return <Spin fullscreen />;
  }

  const renderAddCitySection = (
    <>
      <FormCard>
        <AddCityForm onSubmit={handleAddCity} />
      </FormCard>

      {cities.length >= 2 && (
        <FormCard>
          <CitiesControls
            sorting={sorting}
            setSorting={setSorting}
            onDeleteAll={handleDeleteAll}
          />
        </FormCard>
      )}
    </>
  );

  const isEmpty = cities.length === 0;

  return (
    <PageLayout header={<Header />}>
      <Row justify="center">
        <Col span={24}>
          <Flex vertical style={{ width: '100%' }} gap={16}>
            {existingCity ? (
              <>
                <FormCard>
                  <Button type="default" onClick={handleBack}>
                    ← Back to all cities
                  </Button>
                </FormCard>

                <CitiesList
                  cities={[existingCity]}
                  removingCityId={removingId}
                  onRemove={handleRemove}
                  loadMore={() => {}}
                  hasNext={false}
                  onCityClick={handleOpenCity}
                />
              </>
            ) : (
              <>
                {renderAddCitySection}

                {isEmpty ? (
                  <Flex
                    flex={1}
                    justify="center"
                    align="center"
                    style={{ minHeight: '60vh' }}
                  >
                    <EmptyState description="No cities" />
                  </Flex>
                ) : (
                  <CitiesList
                    key={`${sorting.sortBy}-${sorting.sortOrder}`}
                    cities={cities}
                    removingCityId={removingId}
                    onRemove={handleRemove}
                    loadMore={loadMoreStable}
                    hasNext={hasNext}
                    onCityClick={handleOpenCity}
                  />
                )}
              </>
            )}
          </Flex>
        </Col>
      </Row>

      <ScrollToTopButton />
    </PageLayout>
  );
};
