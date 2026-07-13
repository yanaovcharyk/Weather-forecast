import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import {
  createCurrentWeather,
  createWeather,
} from '@/weather/testing/fixtures';
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

const setup = (state = createCityWeatherState()) => {
  vi.mocked(useCityWeather).mockReturnValue(state);

  return testRender(<CurrentWeatherCard />);
};

describe('CurrentWeatherCard', () => {
  describe('content', () => {
    it('renders city and weather info', () => {
      setup();

      expect(screen.getByText('Kyiv')).toBeInTheDocument();
      expect(screen.getByText('Clear sky')).toBeInTheDocument();
      expect(screen.getByText('20°C')).toBeInTheDocument();
    });

    it('renders custom weather values', () => {
      setup(
        createCityWeatherState({
          weather: createWeather({
            current: createCurrentWeather({
              temp: 30,
              description: 'Rain',
            }),
          }),
        }),
      );

      expect(screen.getByText('30°C')).toBeInTheDocument();
      expect(screen.getByText('Rain')).toBeInTheDocument();
    });

    it('renders local skeleton while current weather is loading', () => {
      const { container } = setup(
        createCityWeatherState({
          cityName: undefined,
          weather: undefined,
          cityLoading: true,
          weatherLoading: true,
        }),
      );

      expect(container.querySelector('.ant-skeleton')).toBeTruthy();
      expect(screen.queryByText('Kyiv')).not.toBeInTheDocument();
    });
  });

  describe('details', () => {
    it('renders weather details', () => {
      setup();

      [
        'Feels like',
        'Humidity',
        'Pressure',
        'Sunrise',
        'Wind',
        'Min',
        'Sunset',
        'Max',
      ].forEach((label) => {
        expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
      });
    });
  });

  describe('icon', () => {
    it('renders weather backgtound img', () => {
      setup();
      expect(screen.getByAltText('Clear sky')).toBeInTheDocument();
    });
  });
});
