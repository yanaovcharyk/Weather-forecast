import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { useCityWeather } from '@/weather/hooks';
import { createCityWeatherState } from '@/weather/testing/mocks';
import { CityDetailsPage } from './CityDetailsPage';

const navigate = vi.fn();

vi.mock('@/weather/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/weather/hooks')>();

  return {
    ...actual,
    useCityWeather: vi.fn(),
  };
});

vi.mock('@/common/components', () => ({
  PageLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Header: () => <div>Header</div>,
  DataBoundary: ({
    loading,
    error,
    errorTitle,
    children,
  }: {
    loading: boolean;
    error?: Error | null;
    errorTitle?: string;
    children: ReactNode;
  }) => {
    if (error) {
      return (
        <div>
          <div>{errorTitle}</div>
          <div>{error.message}</div>
        </div>
      );
    }

    return loading ? <div>Loading...</div> : <div>{children}</div>;
  },
}));

vi.mock('@/weather/components', () => ({
  BackToAllCitiesButton: () => (
    <button onClick={() => navigate('/?test=1')}>← Back to all cities</button>
  ),
  CurrentWeatherCard: ({ cityName }: { cityName: string }) => (
    <div>Current: {cityName}</div>
  ),
  HourlyForecast: () => <div>Hourly</div>,
  DailyForecast: () => <div>Daily</div>,
}));

const setup = (state = createCityWeatherState()) => {
  vi.mocked(useCityWeather).mockReturnValue(state);

  return render(<CityDetailsPage />);
};

describe('CityDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    setup(
      createCityWeatherState({
        cityName: undefined,
        weather: undefined,
        loading: true,
      }),
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    setup(
      createCityWeatherState({
        cityName: undefined,
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

    expect(navigate).toHaveBeenCalledWith('/?test=1');
  });
});
