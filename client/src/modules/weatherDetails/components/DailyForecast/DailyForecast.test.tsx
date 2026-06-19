import { render, screen } from '@testing-library/react';

import { DailyForecast } from './DailyForecast';

describe('DailyForecast', () => {
  const daily = [
    {
      date: '2025-01-01',
      icon: '01d',
      description: 'Sunny',
      min: 10,
      max: 20,
      humidity: 60,
      windSpeed: 4,
      pop: 10,
    },
    {
      date: '2025-01-02',
      icon: '02d',
      description: 'Cloudy',
      min: 8,
      max: 18,
      humidity: 70,
      windSpeed: 5,
      pop: 30,
    },
    {
      date: '2025-01-03',
      icon: '03d',
      description: 'Rain',
      min: 5,
      max: 15,
      humidity: 80,
      windSpeed: 7,
      pop: 70,
    },
    {
      date: '2025-01-04',
      icon: '04d',
      description: 'Extra Day',
      min: 1,
      max: 2,
      humidity: 10,
      windSpeed: 1,
      pop: 1,
    },
  ];

  it('renders forecast title', () => {
    render(<DailyForecast daily={daily as never} />);

    expect(screen.getByText(/3-day forecast/i)).toBeInTheDocument();
  });

  it('renders only first 3 days', () => {
    render(<DailyForecast daily={daily as never} />);

    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('Cloudy')).toBeInTheDocument();
    expect(screen.getByText('Rain')).toBeInTheDocument();

    expect(screen.queryByText('Extra Day')).not.toBeInTheDocument();
  });

  it('renders temperatures', () => {
    render(<DailyForecast daily={daily as never} />);

    expect(screen.getByText('10° / 20°')).toBeInTheDocument();
    expect(screen.getByText('8° / 18°')).toBeInTheDocument();
  });

  it('renders weather metadata', () => {
    render(<DailyForecast daily={daily as never} />);

    expect(screen.getByText(/Humidity: 60%/i)).toBeInTheDocument();

    expect(screen.getByText(/Wind: 4 m\/s/i)).toBeInTheDocument();

    expect(screen.getByText(/Rain: 10%/i)).toBeInTheDocument();
  });
});
