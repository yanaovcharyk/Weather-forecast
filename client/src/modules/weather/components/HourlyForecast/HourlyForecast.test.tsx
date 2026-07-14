import { beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { HourlyForecast } from './HourlyForecast';
import { createHourlyWeather, createWeather } from '@/weather/testing/fixtures';
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

const hourlyForecast = [
  createHourlyWeather(),

  createHourlyWeather({
    time: '15:00',
    temp: 22,
    feelsLike: 21,
    icon: '02d',
  }),
];

describe('HourlyForecast', () => {
  const setup = (
    state = createCityWeatherState({
      weather: createWeather({
        hourly: hourlyForecast,
      }),
    }),
  ) => {
    vi.mocked(useCityWeather).mockReturnValue(state);

    return testRender(<HourlyForecast />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title', () => {
    setup();

    expect(screen.getByText(/hourly forecast/i)).toBeInTheDocument();
  });

  it('renders all hours', () => {
    setup();

    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('renders temperatures', () => {
    setup();

    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('22°C')).toBeInTheDocument();
  });

  it('renders feels like values', () => {
    setup();

    expect(screen.getByText(/Feels\s*18°C/)).toBeInTheDocument();
    expect(screen.getByText(/Feels\s*21°C/)).toBeInTheDocument();
  });

  it('renders weather icons', () => {
    setup();

    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('shows loading state before hourly forecast arrives', () => {
    setup(
      createCityWeatherState({
        weatherLoading: true,
        weather: createWeather({
          hourly: [],
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

    expect(screen.getByText(/hourly forecast/i)).toBeInTheDocument();
  });
});
