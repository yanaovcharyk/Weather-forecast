import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

import { CityCard } from './CityCard';
import type { CityCardRuntimeMocks } from '@/weather/testing/contexts/cityCard.context';
import {
  CITY_CARD_WITH_WEATHER_FIXTURE,
  CITY_CARD_WITHOUT_WEATHER_FIXTURE,
} from '@/weather/testing/contexts/cityCard.context';
import { setupCityCardRuntime } from '@/weather/testing/setups/cityCard.runtime';
import {
  expectExistingCitySelectionCleared,
  setupCityCard,
} from '@/weather/testing/setups/cityCard.setup';

const runtimeMocks = vi.hoisted(
  (): CityCardRuntimeMocks => ({
    navigate: vi.fn(),
    searchParams: new URLSearchParams(),
    setSearchParams: vi.fn(),
    removeCity: vi.fn(),
    togglePinned: vi.fn(),
  }),
);

vi.mock('@/common/hooks', () => ({
  useSmartBackground: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return {
    ...actual,
    useNavigate: () => runtimeMocks.navigate,
    useSearchParams: () => [
      runtimeMocks.searchParams,
      runtimeMocks.setSearchParams,
    ],
  };
});

vi.mock('@/weather/hooks', () => ({
  useRemoveCity: () => ({
    removeCity: runtimeMocks.removeCity,
  }),
  useTogglePinned: () => ({
    togglePinned: runtimeMocks.togglePinned,
  }),
}));

vi.mock('@/weather/utils', () => ({
  getNextDays: vi.fn(() => [
    { weekDay: 'Mon' },
    { weekDay: 'Tue' },
    { weekDay: 'Wed' },
  ]),
  getWeatherBackgroundImage: vi.fn(() => 'bg.jpg'),
}));

describe('CityCard', () => {
  beforeEach(() => {
    setupCityCardRuntime(runtimeMocks);
  });

  it('renders full card with weather', () => {
    setupCityCard();

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
  });

  it('renders skeleton when not loaded', () => {
    setupCityCardRuntime(runtimeMocks, {
      backgroundLoaded: false,
    });

    setupCityCard();

    expect(screen.queryByText('Kyiv')).not.toBeInTheDocument();
  });

  it('renders fallback when weather is null', () => {
    setupCityCard({
      city: CITY_CARD_WITHOUT_WEATHER_FIXTURE,
    });

    expect(screen.getByText('No forecast yet')).toBeInTheDocument();
  });

  it('opens city details when card is clicked', async () => {
    const { user, getCard } = setupCityCard();

    await user.click(getCard());

    expect(runtimeMocks.navigate).toHaveBeenCalledWith('/cities/1');
  });

  it('toggles pinned state from card button', async () => {
    const { user, getPinButton } = setupCityCard();

    await user.click(getPinButton());

    expect(runtimeMocks.togglePinned).toHaveBeenCalledWith('1', false);
    expect(runtimeMocks.navigate).not.toHaveBeenCalled();
  });

  it('removes city from card button', async () => {
    const { user, getRemoveButton } = setupCityCard();

    await user.click(getRemoveButton());

    expect(runtimeMocks.removeCity).toHaveBeenCalledWith('1');
    expect(runtimeMocks.navigate).not.toHaveBeenCalled();
  });

  it('clears existing city selection after removing selected card', async () => {
    runtimeMocks.searchParams = new URLSearchParams('existingId=1&sortBy=name');

    const { user, getRemoveButton } = setupCityCard();

    await user.click(getRemoveButton());

    expectExistingCitySelectionCleared(runtimeMocks);
  });

  it('marks card as loading while remove is pending', async () => {
    runtimeMocks.removeCity.mockReturnValue(new Promise(() => {}));

    const { user, getCard, getPinButton, getRemoveButton } = setupCityCard();

    await user.click(getRemoveButton());

    await waitFor(() => {
      expect(getCard().className).toContain('cardLoading');
    });

    fireEvent.click(getPinButton());
    fireEvent.click(getRemoveButton());

    expect(runtimeMocks.togglePinned).not.toHaveBeenCalled();
    expect(runtimeMocks.removeCity).toHaveBeenCalledTimes(1);
  });

  it('covers pinned icon toggle branch', () => {
    const { rerender, getPinButton } = setupCityCard({
      city: {
        ...CITY_CARD_WITH_WEATHER_FIXTURE,
        isPinned: false,
      },
    });

    expect(getPinButton()).toBeInTheDocument();

    rerender(
      <CityCard
        city={{
          ...CITY_CARD_WITH_WEATHER_FIXTURE,
          isPinned: true,
        }}
      />,
    );

    expect(getPinButton()).toBeInTheDocument();
  });
});
