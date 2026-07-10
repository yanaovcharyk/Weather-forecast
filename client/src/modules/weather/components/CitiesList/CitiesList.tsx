import { Col, Flex, Row, Spin } from 'antd';
import React, { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { DataBoundary, EmptyState } from '@/common/components';
import { BackToAllCitiesButton } from '@/weather/components';
import { CityCard } from '@/weather/components/CityCard';
import {
  useCitiesPaginated,
  useRemoveCity,
  useSortingParams,
  useTogglePinned,
} from '@/weather/hooks';
import { useInfiniteScrollTrigger } from '@/weather/hooks/useInfiniteScrollTrigger';

import styles from './CitiesList.module.scss';

export const CitiesList = React.memo(function CitiesList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const existingId = searchParams.get('existingId');

  const { sorting, showPinnedOnly } = useSortingParams();

  const {
    cities,
    loading,
    error,
    loadMore,
    hasNext: hasNextPage,
  } = useCitiesPaginated(sorting, showPinnedOnly);

  const { removeCity } = useRemoveCity();
  const { togglePinned } = useTogglePinned();

  const [removingCityId, setRemovingCityId] = useState<string | null>(null);

  const visibleCities = existingId
    ? cities.filter((city) => city.id === existingId)
    : cities;

  const isEmpty = !loading && visibleCities.length === 0;
  const shouldShowInfiniteScroll = !existingId && hasNextPage;
  const isListLoading = loading && visibleCities.length === 0;

  const clearExistingCitySelection = useCallback(() => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete('existingId');
    setSearchParams(updatedParams);
  }, [searchParams, setSearchParams]);

  const loadMoreTriggerRef = useInfiniteScrollTrigger({
    hasNextPage: shouldShowInfiniteScroll,
    onLoadMore: loadMore,
  });

  const handleOpenCity = useCallback(
    (id: string) => {
      navigate(`/cities/${id}`);
    },
    [navigate],
  );

  const handleRemoveCity = useCallback(
    async (id: string) => {
      setRemovingCityId(id);

      try {
        await removeCity(id);

        if (existingId === id) {
          clearExistingCitySelection();
        }
      } finally {
        setRemovingCityId(null);
      }
    },
    [removeCity, existingId, clearExistingCitySelection],
  );

  const handleTogglePinned = useCallback(
    async (id: string, isPinned: boolean) => {
      await togglePinned(id, isPinned);
    },
    [togglePinned],
  );

  return (
    <DataBoundary
      loading={isListLoading}
      error={error}
      errorTitle="Failed to load cities"
    >
      <div className={styles.wrapper}>
        {existingId && <BackToAllCitiesButton />}

        {isEmpty ? (
          <Flex
            flex={1}
            justify="center"
            align="center"
            className={styles.emptyState}
          >
            <EmptyState description="No cities" />
          </Flex>
        ) : (
          <>
            <Row
              gutter={[12, 12]}
              className={loading ? styles.blocked : undefined}
            >
              {visibleCities.map((city) => (
                <Col key={city.id} xs={24} sm={24} md={12}>
                  <CityCard
                    city={city}
                    loading={removingCityId === city.id}
                    onOpen={handleOpenCity}
                    onRemove={handleRemoveCity}
                    onTogglePinned={handleTogglePinned}
                  />
                </Col>
              ))}
            </Row>

            {shouldShowInfiniteScroll && (
              <div ref={loadMoreTriggerRef} className={styles.hasNext} />
            )}

            {loading && visibleCities.length > 0 && (
              <div className={styles.overlay}>
                <Spin size="large" />
              </div>
            )}
          </>
        )}
      </div>
    </DataBoundary>
  );
});
