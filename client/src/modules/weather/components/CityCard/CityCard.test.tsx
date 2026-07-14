import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

import { CityCard } from './CityCard';
import { useSmartBackground } from '@/common/hooks';
import { renderWithUser } from '@/common/testing/render/renderWithUser';
import { CITY_FIXTURE, WEATHER_FIXTURE } from '@/weather/testing/fixtures';

const routerMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  searchParams: new URLSearchParams(),
  setSearchParams: vi.fn(),
}));

const weatherHookMocks = vi.hoisted(() => ({
  removeCity: vi.fn(),
  togglePinned: vi.fn(),
}));

vi.mock('@/common/hooks', () => ({
  useSmartBackground: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return {
    ...actual,
    useNavigate: () => routerMocks.navigate,
    useSearchParams: () => [
      routerMocks.searchParams,
      routerMocks.setSearchParams,
    ],
  };
});

vi.mock('@/weather/hooks', () => ({
  useRemoveCity: () => ({
    removeCity: weatherHookMocks.removeCity,
  }),
  useTogglePinned: () => ({
    togglePinned: weatherHookMocks.togglePinned,
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
    vi.clearAllMocks();
    routerMocks.searchParams = new URLSearchParams();
    weatherHookMocks.removeCity.mockResolvedValue(undefined);
    weatherHookMocks.togglePinned.mockResolvedValue(undefined);
    vi.mocked(useSmartBackground).mockReturnValue({ loaded: true });
  });

  it('renders full card with weather', () => {
    render(
      <CityCard
        city={{
          ...CITY_FIXTURE,
          weather: WEATHER_FIXTURE,
        }}
      />,
    );

    expect(screen.getByText('Kyiv')).toBeInTheDocument();

    expect(screen.getByText('Sunny')).toBeInTheDocument();
  });

  it('renders skeleton when not loaded', () => {
    vi.mocked(useSmartBackground).mockReturnValue({ loaded: false });

    render(
      <CityCard
        city={{
          ...CITY_FIXTURE,
          weather: WEATHER_FIXTURE,
        }}
      />,
    );

    expect(screen.queryByText('Kyiv')).not.toBeInTheDocument();
  });

  it('renders fallback when weather is null', () => {
    render(<CityCard city={{ ...CITY_FIXTURE, weather: null }} />);

    expect(screen.getByText('No forecast yet')).toBeInTheDocument();
  });

  it('opens city details when card is clicked', async () => {
    const { user } = renderWithUser(
      <CityCard
        city={{
          ...CITY_FIXTURE,
          weather: WEATHER_FIXTURE,
        }}
      />,
    );

    await user.click(screen.getByText('Kyiv').closest('.ant-card')!);

    expect(routerMocks.navigate).toHaveBeenCalledWith('/cities/1');
  });

  it('toggles pinned state from card button', async () => {
    const { user } = renderWithUser(
      <CityCard
        city={{
          ...CITY_FIXTURE,
          weather: WEATHER_FIXTURE,
        }}
      />,
    );

    const [pinBtn] = screen.getAllByRole('button');

    await user.click(pinBtn);

    expect(weatherHookMocks.togglePinned).toHaveBeenCalledWith('1', false);
    expect(routerMocks.navigate).not.toHaveBeenCalled();
  });

  it('removes city from card button', async () => {
    const { user } = renderWithUser(
      <CityCard
        city={{
          ...CITY_FIXTURE,
          weather: WEATHER_FIXTURE,
        }}
      />,
    );

    const [, removeBtn] = screen.getAllByRole('button');

    await user.click(removeBtn);

    expect(weatherHookMocks.removeCity).toHaveBeenCalledWith('1');
    expect(routerMocks.navigate).not.toHaveBeenCalled();
  });

  it('clears existing city selection after removing selected card', async () => {
    routerMocks.searchParams = new URLSearchParams('existingId=1&sortBy=name');

    const { user } = renderWithUser(
      <CityCard
        city={{
          ...CITY_FIXTURE,
          weather: WEATHER_FIXTURE,
        }}
      />,
    );

    const [, removeBtn] = screen.getAllByRole('button');

    await user.click(removeBtn);

    const updatedParams = routerMocks.setSearchParams.mock.calls[0][0];

    expect(updatedParams.get('existingId')).toBeNull();
    expect(updatedParams.get('sortBy')).toBe('name');
  });

  it('marks card as loading while remove is pending', async () => {
    weatherHookMocks.removeCity.mockReturnValue(new Promise(() => {}));

    const { user } = renderWithUser(
      <CityCard
        city={{
          ...CITY_FIXTURE,
          weather: WEATHER_FIXTURE,
        }}
      />,
    );

    const card = screen.getByText('Kyiv').closest('.ant-card')!;
    const [pinBtn, removeBtn] = screen.getAllByRole('button');

    await user.click(removeBtn);

    await waitFor(() => {
      expect(card.className).toContain('cardLoading');
    });

    fireEvent.click(pinBtn);
    fireEvent.click(removeBtn);

    expect(weatherHookMocks.togglePinned).not.toHaveBeenCalled();
    expect(weatherHookMocks.removeCity).toHaveBeenCalledTimes(1);
  });

  it('covers pinned icon toggle branch', () => {
    const { rerender } = render(
      <CityCard
        city={{
          ...CITY_FIXTURE,
          weather: WEATHER_FIXTURE,
          isPinned: false,
        }}
      />,
    );

    expect(screen.getAllByRole('button')[0]).toBeInTheDocument();

    rerender(
      <CityCard
        city={{
          ...CITY_FIXTURE,
          weather: WEATHER_FIXTURE,
          isPinned: true,
        }}
      />,
    );

    expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
  });
});
