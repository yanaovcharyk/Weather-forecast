import { screen, within } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/common/components', async () => {
  const { ConfirmModalMock } =
    await import('@/weatherForecast/testing/mocks/CitiesControls.mocks');

  return {
    ConfirmModal: ConfirmModalMock,
  };
});

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  const { ButtonMock, CheckboxMock, SelectMock } =
    await import('@/weatherForecast/testing/mocks/CitiesControls.mocks');

  return {
    ...actual,
    Button: ButtonMock,
    Checkbox: CheckboxMock,
    Select: SelectMock,
  };
});

import {
  getSortingUpdater,
  setupCitiesControls as setup,
} from '@/weatherForecast/testing/setups/citiesControls.setup';

describe('CitiesControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders controls', () => {
    setup();

    expect(screen.getByText(/sort by/i)).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /favourites only/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /delete all/i }),
    ).toBeInTheDocument();
  });

  it('updates sortBy via select', async () => {
    const setSorting = vi.fn();
    const { user, getSortSelect } = setup({ setSorting });

    await user.selectOptions(getSortSelect(), 'createdAt');

    const updater = getSortingUpdater(setSorting);

    expect(updater({ sortBy: 'city', sortOrder: 'ASC' })).toEqual({
      sortBy: 'createdAt',
      sortOrder: 'ASC',
    });
  });

  it('toggles sort order from ASC to DESC', async () => {
    const setSorting = vi.fn();
    const { user, getSortOrderButton } = setup({ setSorting });

    await user.click(getSortOrderButton());

    const updater = getSortingUpdater(setSorting);

    expect(updater({ sortBy: 'city', sortOrder: 'ASC' })).toEqual({
      sortBy: 'city',
      sortOrder: 'DESC',
    });
  });

  it('toggles sort order from DESC to ASC', async () => {
    const setSorting = vi.fn();
    const { user, getSortOrderButton } = setup({
      sorting: { sortBy: 'city', sortOrder: 'DESC' },
      setSorting,
    });

    await user.click(getSortOrderButton());

    const updater = getSortingUpdater(setSorting);

    expect(updater({ sortBy: 'city', sortOrder: 'DESC' })).toEqual({
      sortBy: 'city',
      sortOrder: 'ASC',
    });
  });

  it('toggles pinned filter', async () => {
    const setShowPinnedOnly = vi.fn();
    const { user, getPinnedCheckbox } = setup({ setShowPinnedOnly });

    await user.click(getPinnedCheckbox());

    expect(setShowPinnedOnly).toHaveBeenCalledWith(true);
  });

  it('opens and closes confirmation modal', async () => {
    const { user, getDeleteAllButton } = setup();

    await user.click(getDeleteAllButton());

    const dialog = screen.getByRole('dialog');

    expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /cancel/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('confirms delete all', async () => {
    const onDeleteAll = vi.fn().mockResolvedValue(undefined);
    const { user, getDeleteAllButton } = setup({ onDeleteAll });

    await user.click(getDeleteAllButton());
    await user.click(screen.getByTestId('confirm-delete'));

    expect(onDeleteAll).toHaveBeenCalledTimes(1);
  });

  it('disables sorting controls when sorting is disabled', () => {
    const { getSortSelect, getSortOrderButton } = setup({
      disabledStates: {
        sorting: true,
        deleteAll: false,
        pinnedFilter: false,
      },
    });

    expect(getSortSelect()).toBeDisabled();
    expect(getSortOrderButton()).toBeDisabled();
  });

  it('disables delete all button when deleteAll is disabled', () => {
    const { getDeleteAllButton } = setup({
      disabledStates: {
        sorting: false,
        deleteAll: true,
        pinnedFilter: false,
      },
    });

    expect(getDeleteAllButton()).toBeDisabled();
  });

  it('renders down icon when sortOrder is DESC', () => {
    setup({
      sorting: {
        sortBy: 'city',
        sortOrder: 'DESC',
      },
    });

    expect(screen.getByLabelText('arrow-down')).toBeInTheDocument();
  });

  it('renders up icon when sortOrder is ASC', () => {
    setup({
      sorting: {
        sortBy: 'city',
        sortOrder: 'ASC',
      },
    });

    expect(screen.getByLabelText('arrow-up')).toBeInTheDocument();
  });
});
