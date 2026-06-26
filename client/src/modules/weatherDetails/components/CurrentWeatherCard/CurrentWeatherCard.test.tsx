import { render, screen } from '@testing-library/react';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import {
  createCurrentWeather,
  createWeather,
} from '@/weatherDetails/testing/fixtures';

const setup = (
  props: Partial<React.ComponentProps<typeof CurrentWeatherCard>> = {},
) => {
  return render(
    <CurrentWeatherCard city="Kyiv" weather={createWeather()} {...props} />,
  );
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
      setup({
        weather: createWeather({
          current: createCurrentWeather({
            temp: 30,
            description: 'Rain',
          }),
        }),
      });

      expect(screen.getByText('30°C')).toBeInTheDocument();
      expect(screen.getByText('Rain')).toBeInTheDocument();
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
