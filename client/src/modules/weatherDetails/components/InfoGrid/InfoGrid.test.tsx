import { render, screen } from '@testing-library/react';

import { InfoGrid } from './InfoGrid';

describe('InfoGrid', () => {
  const items = [
    {
      label: 'Humidity',
      value: '60%',
    },
    {
      label: 'Wind',
      value: '5 m/s',
    },
    {
      label: 'Pressure',
      value: '1012 hPa',
    },
    {
      label: 'Visibility',
      value: '10 km',
    },
  ];

  it('renders all labels', () => {
    render(<InfoGrid items={items} />);

    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('Wind')).toBeInTheDocument();
    expect(screen.getByText('Pressure')).toBeInTheDocument();
    expect(screen.getByText('Visibility')).toBeInTheDocument();
  });

  it('renders all values', () => {
    render(<InfoGrid items={items} />);

    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('5 m/s')).toBeInTheDocument();
    expect(screen.getByText('1012 hPa')).toBeInTheDocument();
    expect(screen.getByText('10 km')).toBeInTheDocument();
  });

  it('renders with custom column count', () => {
    render(<InfoGrid items={items} column={1} />);

    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('Visibility')).toBeInTheDocument();
  });
});
