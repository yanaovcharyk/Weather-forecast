import { beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { DailyForecast } from './DailyForecast';
import { createDailyWeather, createWeather } from '@/weather/testing/fixtures';
import { useCityWeather } from '@/weather/hooks';
import { createCityWeatherState } from '@/weather/testing/mocks';
import { testRender } from '@/common/testing/render/renderWithProviders';

vi.mock('@/weather/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/weather/hooks')>();

  return {
    ...actual,
    useCityWeather: vi.fn(),
  };
});

const dailyForecast = [
  createDailyWeather({
    date: '2025-01-01',
    icon: '01d',
    description: 'Sunny',
    min: 10,
    max: 20,
    humidity: 60,
    windSpeed: 4,
    pop: 10,
  }),

  createDailyWeather({
    date: '2025-01-02',
    icon: '02d',
    description: 'Cloudy',
    min: 8,
    max: 18,
    humidity: 70,
    windSpeed: 5,
    pop: 30,
  }),

  createDailyWeather({
    date: '2025-01-03',
    icon: '03d',
    description: 'Rain',
    min: 5,
    max: 15,
    humidity: 80,
    windSpeed: 7,
    pop: 70,
  }),

  createDailyWeather({
    date: '2025-01-04',
    icon: '04d',
    description: 'Extra Day',
    min: 1,
    max: 2,
    humidity: 10,
    windSpeed: 1,
    pop: 1,
  }),
];

describe('DailyForecast', () => {
  const setup = (
    state = createCityWeatherState({
      weather: createWeather({
        daily: dailyForecast,
      }),
    }),
  ) => {
    vi.mocked(useCityWeather).mockReturnValue(state);

    return testRender(<DailyForecast />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders forecast title', () => {
    setup();

    expect(screen.getByText(/3-day forecast/i)).toBeInTheDocument();
  });

  it('renders only first 3 days', () => {
    setup();

    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('Cloudy')).toBeInTheDocument();
    expect(screen.getByText('Rain')).toBeInTheDocument();
    expect(screen.queryByText('Extra Day')).not.toBeInTheDocument();
  });

  it('renders temperatures', () => {
    setup();

    expect(screen.getByText(/10\s*°\s*\/\s*20\s*°/)).toBeInTheDocument();
    expect(screen.getByText(/8\s*°\s*\/\s*18\s*°/)).toBeInTheDocument();
  });

  it('renders weather metadata', () => {
    setup();

    expect(screen.getByText(/Humidity:\s*60%/i)).toBeInTheDocument();
    expect(screen.getByText(/Wind:\s*4\s*m\/s/i)).toBeInTheDocument();
    expect(screen.getByText(/Rain:\s*10%/i)).toBeInTheDocument();
  });

  it('shows loading state before daily forecast arrives', () => {
    setup(
      createCityWeatherState({
        weatherLoading: true,
        weather: createWeather({
          daily: [],
        }),
      }),
    );

    expect(document.querySelector('.ant-card-loading')).toBeInTheDocument();
  });

  it('renders empty forecast when weather is missing', () => {
    setup(
      createCityWeatherState({
        weather: undefined,
      }),
    );

    expect(screen.getByText(/3-day forecast/i)).toBeInTheDocument();
  });
});
