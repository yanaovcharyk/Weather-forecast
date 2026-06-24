import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNavigate, useSearchParams } from 'react-router';
import type { ReactNode } from 'react';
import { CityDetailsPage } from './CityDetailsPage';
import { useCityWeather } from '@/weatherDetails/hooks';
import { createCityWeatherState } from '@/weatherDetails/test/fixtures';

vi.mock('@/weatherDetails/hooks/useCityWeather');

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/common/components', () => ({
  PageLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Header: () => <div>Header</div>,
  AppCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  BlurLoaderOverlay: ({
    loading,
    children,
  }: {
    loading: boolean;
    children: ReactNode;
  }) => (loading ? <div>Loading...</div> : <div>{children}</div>),
}));

vi.mock('@/weatherDetails/components', () => ({
  CurrentWeatherCard: ({ city }: { city: string }) => (
    <div>Current: {city}</div>
  ),
  HourlyForecast: () => <div>Hourly</div>,
  DailyForecast: () => <div>Daily</div>,
}));

const navigateMock = vi.fn();
const searchParamsMock = new URLSearchParams('test=1');

const setup = (state = createCityWeatherState()) => {
  vi.mocked(useCityWeather).mockReturnValue(state);

  return render(<CityDetailsPage />);
};

describe('CityDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(navigateMock);
    vi.mocked(useSearchParams).mockReturnValue([searchParamsMock, vi.fn()]);
  });

  it('shows loading state', () => {
    setup(
      createCityWeatherState({
        city: undefined,
        weather: undefined,
        loading: true,
      }),
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    setup(
      createCityWeatherState({
        city: undefined,
        weather: undefined,
        error: new Error('Network error'),
      }),
    );

    expect(screen.getByText('Failed to load weather data')).toBeInTheDocument();

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders weather data', () => {
    setup();

    ['Current: Kyiv', 'Hourly', 'Daily'].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('navigates back on click', () => {
    setup();

    fireEvent.click(screen.getByText('← Back to all cities'));

    expect(navigateMock).toHaveBeenCalledWith('/?test=1');
  });
});
