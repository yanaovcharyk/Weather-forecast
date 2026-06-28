import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';

import {
  CitiesControls,
  type CitiesControlsProps,
} from '@/weatherForecast/components/CitiesControlBar/CitiesControls';

type Sorting = CitiesControlsProps['sorting'];
type SortingUpdater = (previous: Sorting) => Sorting;

export const createCitiesControlsProps = (
  overrides: Partial<CitiesControlsProps> = {},
): CitiesControlsProps => ({
  sorting: {
    sortBy: 'cityName',
    sortOrder: 'ASC',
  },
  setSorting: vi.fn() as CitiesControlsProps['setSorting'],
  onDeleteAll: vi.fn().mockResolvedValue(undefined),
  showPinnedOnly: false,
  setShowPinnedOnly: vi.fn() as CitiesControlsProps['setShowPinnedOnly'],
  disabledStates: {
    sorting: false,
    deleteAll: false,
    pinnedFilter: false,
  },
  ...overrides,
});

export const setupCitiesControls = (
  overrides: Partial<CitiesControlsProps> = {},
) => {
  const props = createCitiesControlsProps(overrides);
  const user = userEvent.setup();

  render(<CitiesControls {...props} />);

  return {
    user,
    props,
    getSortSelect: () =>
      screen.getByRole('combobox', {
        name: /sort by/i,
      }),
    getSortOrderButton: () => screen.getAllByRole('button')[0],
    getPinnedCheckbox: () =>
      screen.getByRole('checkbox', {
        name: /favourites only/i,
      }),
    getDeleteAllButton: () =>
      screen.getByRole('button', {
        name: /delete all/i,
      }),
  };
};

export const getSortingUpdater = (mock: Mock): SortingUpdater =>
  mock.mock.calls[0][0] as SortingUpdater;
