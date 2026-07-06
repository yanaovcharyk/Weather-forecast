import { Row, Col, Flex } from 'antd';
import {
  AddCityForm,
  CitiesList,
  CitiesControls,
  ExistingCityLayout,
} from '@/weatherForecast/components';
import {
  EmptyState,
  AppCard,
  PageLayout,
  Header,
  ScrollToTopButton,
} from '@/common/components';
import {
  useSortingParams,
  useCityActions,
  useCitiesPaginated,
} from '@/weatherForecast/hooks';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useToast } from '@/common/hooks/useToast';

export const CitiesPage = () => {
  const { sorting, setSorting, showPinnedOnly, setShowPinnedOnly } =
    useSortingParams();

  const { toast } = useToast();
  const showSuccessNotification = (msg: string) => toast('success', msg);
  const showErrorNotification = (msg: string) => toast('error', msg);
  const showInfoNotification = (msg: string) => toast('info', msg);

  const {
    handleAddCity,
    handleRemoveCity,
    handleTogglePinned,
    handleDeleteAllCities,
    clearExistingCitySelection,
    isAddingCity,
    currentlyRemovingCityId,
    currentlySelectedCity,
  } = useCityActions({
    showSuccessNotification,
    showErrorNotification,
    showInfoNotification,
  });

  const { cities, loading, loadMore, hasNext } = useCitiesPaginated(
    sorting,
    showPinnedOnly,
  );

  const navigate = useNavigate();

  const filteredCities = useMemo(() => {
    return showPinnedOnly ? cities.filter((city) => city.isPinned) : cities;
  }, [cities, showPinnedOnly]);

  const controlsPanelDisabled = useMemo(
    () => ({
      sorting: cities.length <= 1,
      deleteAll: cities.length === 0,
      pinnedFilter: !cities.some((city) => city.isPinned),
    }),
    [cities],
  );

  const isEmpty = !loading && filteredCities.length === 0;
  const handleOpenCity = (id: string) => {
    navigate(`/cities/${id}`);
  };

  return (
    <PageLayout header={<Header />}>
      <Row justify="center">
        <Col span={24}>
          <Flex vertical style={{ width: '100%' }} gap={16}>
            {currentlySelectedCity ? (
              <ExistingCityLayout
                existingCity={currentlySelectedCity}
                onBack={clearExistingCitySelection}
                removingId={currentlyRemovingCityId}
                onRemove={handleRemoveCity}
                onTogglePinned={handleTogglePinned}
                loading={loading}
                onCityClick={handleOpenCity}
              />
            ) : (
              <>
                <AddCityForm onSubmit={handleAddCity} disabled={isAddingCity} />
                <AppCard>
                  <CitiesControls
                    sorting={sorting}
                    setSorting={setSorting}
                    onDeleteAll={handleDeleteAllCities}
                    showPinnedOnly={showPinnedOnly}
                    setShowPinnedOnly={setShowPinnedOnly}
                    disabledStates={controlsPanelDisabled}
                  />
                </AppCard>
                {isEmpty ? (
                  <Flex
                    flex={1}
                    justify="center"
                    align="center"
                    className="empty-state-container"
                    style={{ minHeight: '60vh' }}
                  >
                    <EmptyState description="No cities" />
                  </Flex>
                ) : (
                  <CitiesList
                    key={`${sorting.sortBy}-${sorting.sortOrder}-${showPinnedOnly}`}
                    cities={filteredCities}
                    removingCityId={currentlyRemovingCityId}
                    onRemove={handleRemoveCity}
                    onTogglePinned={handleTogglePinned}
                    loadMore={loadMore}
                    hasNext={hasNext}
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
