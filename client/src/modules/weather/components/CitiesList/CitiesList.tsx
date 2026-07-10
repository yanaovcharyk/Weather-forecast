import { Col, Flex, Row, Spin } from 'antd';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { DataBoundary, EmptyState } from '@/common/components';
import { BackToAllCitiesButton } from '@/weather/components';
import { CityCard } from '@/weather/components/CityCard';
import { useCitiesPaginated, useSortingParams } from '@/weather/hooks';
import { useInfiniteScrollTrigger } from '@/weather/hooks/useInfiniteScrollTrigger';

import styles from './CitiesList.module.scss';

export const CitiesList = React.memo(function CitiesList() {
  const [searchParams] = useSearchParams();
  const existingId = searchParams.get('existingId');
  const { sorting, showPinnedOnly } = useSortingParams();

  const {
    cities,
    loading,
    error,
    loadMore,
    hasNext: hasNextPage,
  } = useCitiesPaginated(sorting, showPinnedOnly);

  const visibleCities = existingId
    ? cities.filter((city) => city.id === existingId)
    : cities;

  const isEmpty = !loading && visibleCities.length === 0;
  const shouldShowInfiniteScroll = !existingId && hasNextPage;
  const isListLoading = loading && visibleCities.length === 0;

  const loadMoreTriggerRef = useInfiniteScrollTrigger({
    hasNextPage: shouldShowInfiniteScroll,
    onLoadMore: loadMore,
  });

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
                  <CityCard city={city} />
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
