import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { CityDetailsPage } from './CityDetailsPage';

import { useCityWeather } from '../hooks/useCityWeather';
import { useNavigate, useSearchParams } from 'react-router';
import type { ReactNode } from 'react';

vi.mock('../hooks/useCityWeather');

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

vi.mock('../components', () => ({
  CurrentWeatherCard: ({ city }: { city: { name: string } }) => (
    <div>Current: {city.name}</div>
  ),
  HourlyForecast: () => <div>Hourly</div>,
  DailyForecast: () => <div>Daily</div>,
}));

describe('CityDetailsPage', () => {
  const navigateMock = vi.fn();
  const searchParamsMock = new URLSearchParams('test=1');

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as Mock).mockReturnValue(navigateMock);
    (useSearchParams as Mock).mockReturnValue([searchParamsMock]);
  });

  it('shows loading state', () => {
    (useCityWeather as Mock).mockReturnValue({
      city: null,
      weather: null,
      loading: true,
      error: null,
    });

    render(<CityDetailsPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useCityWeather as Mock).mockReturnValue({
      city: null,
      weather: null,
      loading: false,
      error: { message: 'Network error' },
    });

    render(<CityDetailsPage />);

    expect(screen.getByText('Failed to load weather data')).toBeInTheDocument();

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders weather data', () => {
    (useCityWeather as Mock).mockReturnValue({
      city: { name: 'Kyiv' },
      weather: {
        hourly: [],
        daily: [],
      },
      loading: false,
      error: null,
    });

    render(<CityDetailsPage />);

    expect(screen.getByText('Current: Kyiv')).toBeInTheDocument();
    expect(screen.getByText('Hourly')).toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
  });

  it('navigates back on click', () => {
    (useCityWeather as Mock).mockReturnValue({
      city: { name: 'Kyiv' },
      weather: { hourly: [], daily: [] },
      loading: false,
      error: null,
    });

    render(<CityDetailsPage />);

    fireEvent.click(screen.getByText('← Back to all cities'));

    expect(navigateMock).toHaveBeenCalledWith('/?test=1');
  });
});
