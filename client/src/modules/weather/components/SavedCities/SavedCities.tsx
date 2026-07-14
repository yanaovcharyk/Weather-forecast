import { StyledCard } from '@/common/components';
import { CitiesListHeader, CitiesList } from '@/weather/components';

export const SavedCities = () => {
  return (
    <>
      <StyledCard>
        <CitiesListHeader />
      </StyledCard>

      <CitiesList />
    </>
  );
};
