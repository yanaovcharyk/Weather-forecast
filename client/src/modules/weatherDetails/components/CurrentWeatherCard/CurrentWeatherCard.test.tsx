import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { CurrentWeatherCard } from './CurrentWeatherCard';

vi.mock('@/weatherForecast/utils', () => ({
  getWeatherBackground: vi.fn(() => 'weather-bg.jpg'),
}));

vi.mock('../InfoGrid', () => ({
  InfoGrid: ({ items }: { items: { label: string; value: string }[] }) => (
    <div>
      {items.map((item) => (
        <div key={item.label}>
          {item.label}: {item.value}
        </div>
      ))}
    </div>
  ),
}));

describe('CurrentWeatherCard', () => {
  const weather = {
    current: {
      temp: 20,
      feelsLike: 18,
      humidity: 70,
      windSpeed: 4,
      pressure: 1012,
      min: 15,
      max: 25,
      sunrise: '06:00',
      sunset: '20:00',
      icon: '01d',
      description: 'Clear sky',
    },
  };

  it('renders city and weather info', () => {
    render(<CurrentWeatherCard city="Kyiv" weather={weather as never} />);

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(screen.getByText('Clear sky')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
  });

  it('renders weather details', () => {
    render(<CurrentWeatherCard city="Kyiv" weather={weather as never} />);

    expect(screen.getByText(/Feels like/i)).toBeInTheDocument();
    expect(screen.getByText(/Humidity/i)).toBeInTheDocument();
    expect(screen.getByText(/Pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/Sunrise/i)).toBeInTheDocument();
  });

  it('renders weather icon', () => {
    render(<CurrentWeatherCard city="Kyiv" weather={weather as never} />);

    expect(screen.getByAltText('Clear sky')).toBeInTheDocument();
  });
});
