import { beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HourlyForecast } from './HourlyForecast';
import { createHourlyWeather } from '@/weatherDetails/testing/fixtures';

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
  beforeEach(() => {
    render(<HourlyForecast hourly={hourlyForecast} />);
  });

  it('renders title', () => {
    expect(screen.getByText(/hourly forecast/i)).toBeInTheDocument();
  });

  it('renders all hours', () => {
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('renders temperatures', () => {
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('22°C')).toBeInTheDocument();
  });

  it('renders feels like values', () => {
    expect(screen.getByText(/Feels\s*18°C/)).toBeInTheDocument();
    expect(screen.getByText(/Feels\s*21°C/)).toBeInTheDocument();
  });

  it('renders weather icons', () => {
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });
});
