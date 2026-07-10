import { screen, within } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/common/components', async () => {
  const actual = await vi.importActual<typeof import('@/common/components')>(
    '@/common/components',
  );
  const { ConfirmModalMock } =
    await import('@/weather/testing/mocks/CitiesControls.mocks');

  return {
    ...actual,
    ConfirmModal: ConfirmModalMock,
  };
});

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  const { ButtonMock, CheckboxMock, SelectMock } =
    await import('@/weather/testing/mocks/CitiesControls.mocks');

  return {
    ...actual,
    Button: ButtonMock,
    Checkbox: CheckboxMock,
    Select: SelectMock,
  };
});

vi.mock('@/weather/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/weather/hooks')>();

  return {
    ...actual,
    useCitiesPaginated: vi.fn(),
    useRemoveAllCities: vi.fn(),
    useSortingParams: vi.fn(),
  };
});

vi.mock('@/common/hooks/useToast', () => ({
  useToast: vi.fn(),
}));

import {
  getSortingUpdater,
  setupCitiesControls as setup,
} from '@/weather/testing/setups/citiesControls.setup';
import { CitySortField, CitySortOrder } from '@/weather/types';

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

    await user.selectOptions(getSortSelect(), CitySortField.CreatedAt);

    const updater = getSortingUpdater(setSorting);

    expect(
      updater({
        sortBy: CitySortField.CityName,
        sortOrder: CitySortOrder.Asc,
      }),
    ).toEqual({
      sortBy: CitySortField.CreatedAt,
      sortOrder: CitySortOrder.Asc,
    });
  });

  it('toggles sort order from ASC to DESC', async () => {
    const setSorting = vi.fn();
    const { user, getSortOrderButton } = setup({ setSorting });

    await user.click(getSortOrderButton());

    const updater = getSortingUpdater(setSorting);

    expect(
      updater({
        sortBy: CitySortField.CityName,
        sortOrder: CitySortOrder.Asc,
      }),
    ).toEqual({
      sortBy: CitySortField.CityName,
      sortOrder: CitySortOrder.Desc,
    });
  });

  it('toggles sort order from DESC to ASC', async () => {
    const setSorting = vi.fn();
    const { user, getSortOrderButton } = setup({
      sorting: {
        sortBy: CitySortField.CityName,
        sortOrder: CitySortOrder.Desc,
      },
      setSorting,
    });

    await user.click(getSortOrderButton());

    const updater = getSortingUpdater(setSorting);

    expect(
      updater({
        sortBy: CitySortField.CityName,
        sortOrder: CitySortOrder.Desc,
      }),
    ).toEqual({
      sortBy: CitySortField.CityName,
      sortOrder: CitySortOrder.Asc,
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
    const removeAllCities = vi
      .fn()
      .mockResolvedValue({ ok: true, code: undefined });
    const { user, getDeleteAllButton } = setup({ removeAllCities });

    await user.click(getDeleteAllButton());
    await user.click(screen.getByTestId('confirm-delete'));

    expect(removeAllCities).toHaveBeenCalledTimes(1);
  });

  it('disables sorting controls when sorting is disabled', () => {
    const { getSortSelect, getSortOrderButton } = setup({ cities: [] });

    expect(getSortSelect()).toBeDisabled();
    expect(getSortOrderButton()).toBeDisabled();
  });

  it('disables delete all button when deleteAll is disabled', () => {
    const { getDeleteAllButton } = setup({ cities: [] });

    expect(getDeleteAllButton()).toBeDisabled();
  });

  it('renders down icon when sortOrder is DESC', () => {
    setup({
      sorting: {
        sortBy: CitySortField.CityName,
        sortOrder: CitySortOrder.Desc,
      },
    });

    expect(screen.getByLabelText('arrow-down')).toBeInTheDocument();
  });

  it('renders up icon when sortOrder is ASC', () => {
    setup({
      sorting: {
        sortBy: CitySortField.CityName,
        sortOrder: CitySortOrder.Asc,
      },
    });

    expect(screen.getByLabelText('arrow-up')).toBeInTheDocument();
  });
});
