import { Row, Col, App, Button, Flex } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useRemoveCity, useAddCity } from '../hooks';
import { useCitiesPaginated } from '../hooks/useCitiesPaginated';
import { useRemoveAllCities } from '../hooks/useRemoveAllCities';
import { useTogglePinned } from '../hooks/useTogglePinned';
import { AddCityForm, CitiesList } from '../components';
import { EmptyState, AppCard, PageLayout, Header } from '@/common/components';
import { ScrollToTopButton } from '../../common/components/ScrollToTopButton';
import { handleResult } from '@/common/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CitiesControls } from '../components/CitiesControlBar/CitiesControls';
import type { City } from '../../common/types';
import type { SortingState } from '../types';

export const CitiesPage = () => {
  const [params, setParams] = useSearchParams();

  const initialSorting: SortingState = {
    sortBy: (params.get('sortBy') as 'createdAt' | 'city') ?? 'createdAt',
    sortOrder: (params.get('sortOrder') as 'ASC' | 'DESC') ?? 'DESC',
  };

  const initialPinned = params.get('showPinnedOnly') === 'true';
  const existingId = params.get('existingId');

  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [showPinnedOnly, setShowPinnedOnly] = useState(initialPinned);

  const [existingCity, setExistingCity] = useState<City | null>(null);

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
  const [adding, setAdding] = useState(false);

  const notifyError = useCallback(
    (msg: string) => message.error(msg),
    [message],
  );

  const notifySuccess = useCallback(
    (msg: string) => message.success(msg),
    [message],
  );

  const controlsDisabled = {
    sorting: cities.length <= 1,
    deleteAll: cities.length === 0,
    pinnedFilter: cities.every((c) => !c.isPinned),
  };

  useEffect(() => {
    const next = new URLSearchParams(params);

    next.set('sortBy', sorting.sortBy);
    next.set('sortOrder', sorting.sortOrder);
    next.set('showPinnedOnly', String(showPinnedOnly));

    setParams(next);
  }, [sorting, showPinnedOnly, setParams, params]);

  const handleAddCity = useCallback(
    async (lat: number, lon: number, city: string) => {
      if (adding) return;

      setAdding(true);

      try {
        const result = await addCity(lat, lon, city);

        if (
          !result.ok &&
          result.code === 'CITY_EXISTS' &&
          result.existingCity
        ) {
          const next = new URLSearchParams(params);
          next.set('existingId', String(result.existingCity.id));
          setParams(next);

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
    [adding, addCity, params, setParams, message, notifyError, notifySuccess],
  );

  const handleRemove = useCallback(
    async (id: number, city: string) => {
      setRemovingId(id);

      try {
        await removeCity(id);

        if (existingId && Number(existingId) === id) {
          const next = new URLSearchParams(params);
          next.delete('existingId');
          setParams(next);

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
    [removeCity, existingId, params, setParams, notifyError, notifySuccess],
  );

  const handleTogglePinned = useCallback(
    async (id: number, currentPinned: boolean) => {
      await togglePinned(id, currentPinned);

      setExistingCity((prev) =>
        prev && prev.id === id ? { ...prev, isPinned: !prev.isPinned } : prev,
      );
    },
    [togglePinned],
  );

  const handleOpenCity = useCallback(
    (id: number) => {
      navigate(`/cities/${id}?${params.toString()}`);
    },
    [navigate, params],
  );

  const handleDeleteAll = useCallback(async () => {
    const result = await removeAllCities();

    handleResult(result, {
      successMessage: 'All cities removed successfully',
      notifyError,
      notifySuccess,
    });
  }, [removeAllCities, notifyError, notifySuccess]);

  const handleBack = () => {
    const next = new URLSearchParams(params);
    next.delete('existingId');
    setParams(next);

    setExistingCity(null);
  };

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
                  key={`existing-${existingCity.id}`}
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

                <AppCard>
                  <CitiesControls
                    sorting={sorting}
                    setSorting={setSorting}
                    onDeleteAll={handleDeleteAll}
                    showPinnedOnly={showPinnedOnly}
                    setShowPinnedOnly={setShowPinnedOnly}
                    disabledStates={controlsDisabled}
                  />
                </AppCard>

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
