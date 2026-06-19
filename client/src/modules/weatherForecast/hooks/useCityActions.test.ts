import { handleResult } from '@/common/utils';
import {
  createCityActionsContext,
  type CityActionsContext,
} from '../test/contexts/cityActions.context';
import { setupCityActionsRuntime } from '../test/setups/cityActions.runtime';
import { setupCityActions } from '../test/setups/cityActions.setup';
import {
  CITY_FIXTURE,
  EXISTING_CITY_FIXTURE,
} from '../test/fixtures/city.fixture';
import { act } from 'react';

vi.mock('./useAddCity');
vi.mock('./useRemoveCity');
vi.mock('./useRemoveAllCities');
vi.mock('./useTogglePinned');
vi.mock('./useCityByName');
vi.mock('@/common/utils');

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('useCityActions', () => {
  let ctx: CityActionsContext;

  beforeEach(() => {
    ctx = createCityActionsContext();

    setupCityActionsRuntime(ctx);
  });

  it('shows existing city notification', async () => {
    ctx.getCityByName.mockResolvedValue(EXISTING_CITY_FIXTURE);

    const { handleAddCity } = setupCityActions(ctx);

    await handleAddCity(CITY_FIXTURE.lat, CITY_FIXTURE.lon, CITY_FIXTURE.city);

    expect(ctx.addCity).not.toHaveBeenCalled();

    expect(ctx.showInfoNotification).toHaveBeenCalledWith(
      `City ${CITY_FIXTURE.city} already exists`,
    );

    expect(ctx.setSearchParams).toHaveBeenCalled();
  });

  it('handles add city error', async () => {
    ctx.getCityByName.mockRejectedValue(new Error());

    const { handleAddCity } = setupCityActions(ctx);

    await handleAddCity(CITY_FIXTURE.lat, CITY_FIXTURE.lon, CITY_FIXTURE.city);

    expect(ctx.showErrorNotification).toHaveBeenCalledWith(
      'Failed to add city',
    );
  });

  it('removes city successfully', async () => {
    const { handleRemoveCity } = setupCityActions(ctx);

    await handleRemoveCity(CITY_FIXTURE.id, CITY_FIXTURE.city);

    expect(ctx.removeCity).toHaveBeenCalledWith(CITY_FIXTURE.id);

    expect(handleResult).toHaveBeenCalled();
  });

  it('clears selected city when removed city is selected', async () => {
    setupCityActionsRuntime(ctx, {
      existingId: CITY_FIXTURE.id,
    });

    const { handleRemoveCity } = setupCityActions(ctx);

    await handleRemoveCity(CITY_FIXTURE.id, CITY_FIXTURE.city);

    expect(ctx.setSearchParams).toHaveBeenCalled();

    // expect(ctx.searchParams.delete).toHaveBeenCalledWith('existingId');
  });

  it('toggles pinned city', async () => {
    const { handleTogglePinned } = setupCityActions(ctx);

    await handleTogglePinned(CITY_FIXTURE.id, false);

    expect(ctx.togglePinned).toHaveBeenCalledWith(CITY_FIXTURE.id, false);
  });

  it('removes all cities', async () => {
    ctx.removeAllCities.mockResolvedValue({
      ok: true,
      code: undefined,
    });

    const { handleDeleteAllCities } = setupCityActions(ctx);

    await handleDeleteAllCities();

    expect(ctx.removeAllCities).toHaveBeenCalled();

    expect(handleResult).toHaveBeenCalled();
  });

  it('adds city successfully', async () => {
    ctx.addCity.mockResolvedValue(CITY_FIXTURE);

    const { handleAddCity } = setupCityActions(ctx);

    await act(async () => {
      await handleAddCity(
        CITY_FIXTURE.lat,
        CITY_FIXTURE.lon,
        CITY_FIXTURE.city,
      );
    });

    expect(ctx.showSuccessNotification).toHaveBeenCalledWith(
      `City ${CITY_FIXTURE.city} added successfully`,
    );
  });
});
