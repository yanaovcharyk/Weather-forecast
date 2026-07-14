import { screen } from '@testing-library/react';

import { renderWithUser } from '@/common/testing/render/renderWithUser';
import { CityCard } from '@/weather/components/CityCard/CityCard';
import {
  CITY_CARD_WITH_WEATHER_FIXTURE,
  type CityCardRuntimeMocks,
} from '@/weather/testing/contexts/cityCard.context';
import type { City } from '@/weather/types';

export const setupCityCard = ({
  city = CITY_CARD_WITH_WEATHER_FIXTURE,
}: {
  city?: City;
} = {}) => ({
  ...renderWithUser(<CityCard city={city} />),
  getCard: () => screen.getByText(city.cityName).closest('.ant-card')!,
  getPinButton: () => screen.getAllByRole('button')[0],
  getRemoveButton: () => screen.getAllByRole('button')[1],
});

export const expectExistingCitySelectionCleared = (
  mocks: Pick<CityCardRuntimeMocks, 'setSearchParams'>,
) => {
  const updatedParams = mocks.setSearchParams.mock.calls[0][0];

  expect(updatedParams.get('existingId')).toBeNull();
  expect(updatedParams.get('sortBy')).toBe('name');
};
