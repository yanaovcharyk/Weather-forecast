import { Row, Col, App, Button, Flex } from 'antd';
import { useCallback, useState } from 'react';

import { useRemoveCity, useAddCity } from '../hooks';
import { useCitiesPaginated } from '../hooks/useCitiesPaginated';
import { useRemoveAllCities } from '../hooks/useRemoveAllCities';
import { useTogglePinned } from '../hooks/useTogglePinned';

import { AddCityForm, CitiesList } from '../components';
import { EmptyState, AppCard, PageLayout, Header } from '@/common/components';

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

  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const { message } = App.useApp();
  const navigate = useNavigate();

  const { cities, loading, loadMore, hasNext } = useCitiesPaginated(
    sorting,
    showPinnedOnly,
  );

  const loadMoreStable = useCallback(() => loadMore(), [loadMore]);

  const { addCity } = useAddCity();
  const { removeCity } = useRemoveCity();
  const { removeAllCities } = useRemoveAllCities();
  const { togglePinned } = useTogglePinned();

  const [removingId, setRemovingId] = useState<number | null>(null);
  const [existingCity, setExistingCity] = useState<City | null>(null);
  const [adding, setAdding] = useState(false);

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
      if (adding) return;

      setAdding(true);

      try {
        const result = await addCity(lat, lon, city);

        if (!result.ok && result.code === 'CITY_EXISTS') {
          setExistingCity(result.existingCity);
          message.info(`City ${city} already exists`);
          return;
        }

        handleResult(
          {
            ok: result.ok,
            code: result.code ?? undefined,
          },
          {
            successMessage: `City ${city} added successfully`,
            notifyError,
            notifySuccess,
          },
        );
      } finally {
        setAdding(false);
      }
    },
    [adding, addCity, message, notifyError, notifySuccess],
  );

  const handleRemove = useCallback(
    async (id: number, city: string) => {
      setRemovingId(id);

      try {
        await removeCity(id);

        if (existingCity?.id === id) {
          setExistingCity(null);
        }

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
    [removeCity, existingCity, notifyError, notifySuccess],
  );

  const handleTogglePinned = useCallback(
    async (id: number) => {
      await togglePinned(id);
    },
    [togglePinned],
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

  const filteredCities = showPinnedOnly
    ? cities.filter((c) => c.isPinned)
    : cities;

  const isEmpty = !loading && filteredCities.length === 0;

  return (
    <PageLayout header={<Header />}>
      <Row justify="center">
        <Col span={24}>
          <Flex vertical style={{ width: '100%' }} gap={16}>
            {existingCity ? (
              <>
                <AppCard>
                  <Button type="default" onClick={handleBack}>
                    ← Back to all cities
                  </Button>
                </AppCard>

                <CitiesList
                  key={`${sorting.sortBy}-${sorting.sortOrder}-${showPinnedOnly}`}
                  cities={[existingCity]}
                  removingCityId={removingId}
                  onRemove={handleRemove}
                  onTogglePinned={handleTogglePinned}
                  loadMore={() => {}}
                  hasNext={false}
                  onCityClick={handleOpenCity}
                  loading={loading && cities.length === 0}
                />
              </>
            ) : (
              <>
                <AddCityForm onSubmit={handleAddCity} disabled={adding} />

                {cities.length >= 2 && (
                  <AppCard>
                    <CitiesControls
                      sorting={sorting}
                      setSorting={setSorting}
                      onDeleteAll={handleDeleteAll}
                      showPinnedOnly={showPinnedOnly}
                      setShowPinnedOnly={setShowPinnedOnly}
                    />
                  </AppCard>
                )}

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
                    key={`${sorting.sortBy}-${sorting.sortOrder}-${showPinnedOnly}`}
                    cities={filteredCities}
                    removingCityId={removingId}
                    onRemove={handleRemove}
                    onTogglePinned={handleTogglePinned}
                    loadMore={loadMoreStable}
                    hasNext={hasNext && !showPinnedOnly}
                    onCityClick={handleOpenCity}
                    loading={loading && cities.length === 0}
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
