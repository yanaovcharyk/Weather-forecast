import { AppCard } from '@/common/components';
import { CitiesListHeader, CitiesList } from '@/weather/components';

export const SavedCities = () => {
  return (
    <>
      <AppCard>
        <CitiesListHeader />
      </AppCard>

      <CitiesList />
    </>
  );
};
