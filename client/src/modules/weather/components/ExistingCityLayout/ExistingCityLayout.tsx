import { Button } from 'antd';
import { AppCard } from '@/common/components';
import { CitiesList } from '@/weather/components/CitiesList';
import type { City } from '@/weather/types';

export interface ExistingCityLaypoutProps {
  existingCity: City;
  onBack: () => void;
  removingId: string | null;
  onRemove: (id: string, cityName: string) => void;
  onTogglePinned: (id: string, currentPinned: boolean) => void;
  loading: boolean;
  onCityClick: (id: string) => void;
}

export const ExistingCityLayout = ({
  existingCity,
  onBack,
  removingId,
  onRemove,
  onTogglePinned,
  loading,
  onCityClick,
}: ExistingCityLaypoutProps) => {
  return (
    <>
      <AppCard>
        <Button type="default" onClick={onBack}>
          ← Back to all cities
        </Button>
      </AppCard>
      <CitiesList
        key={`existing-${existingCity.id}`}
        cities={[existingCity]}
        removingCityId={removingId}
        onRemove={onRemove}
        onTogglePinned={onTogglePinned}
        onLoadMore={() => {}}
        hasNextPage={false}
        onCityClick={onCityClick}
        isListLoading={loading && !existingCity}
      />
    </>
  );
};
