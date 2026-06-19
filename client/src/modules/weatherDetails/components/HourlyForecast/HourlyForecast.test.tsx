import { render, screen } from '@testing-library/react';

import { HourlyForecast } from './HourlyForecast';

describe('HourlyForecast', () => {
  const hourly = [
    {
      time: '12:00',
      temp: 20,
      feelsLike: 18,
      icon: '01d',
    },
    {
      time: '15:00',
      temp: 22,
      feelsLike: 21,
      icon: '02d',
    },
  ];

  it('renders title', () => {
    render(<HourlyForecast hourly={hourly as never} />);

    expect(screen.getByText(/hourly forecast/i)).toBeInTheDocument();
  });

  it('renders all hours', () => {
    render(<HourlyForecast hourly={hourly as never} />);

    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('renders temperatures', () => {
    render(<HourlyForecast hourly={hourly as never} />);

    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('22°C')).toBeInTheDocument();
  });

  it('renders feels like values', () => {
    render(<HourlyForecast hourly={hourly as never} />);

    expect(screen.getByText('Feels 18°C')).toBeInTheDocument();

    expect(screen.getByText('Feels 21°C')).toBeInTheDocument();
  });

  it('renders weather icons', () => {
    render(<HourlyForecast hourly={hourly as never} />);

    expect(screen.getAllByRole('img')).toHaveLength(2);
  });
});
