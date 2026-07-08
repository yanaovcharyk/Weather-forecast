import { render, screen } from '@testing-library/react';
import { InfoGrid } from './InfoGrid';

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

const setup = (props = {}) => {
  render(<InfoGrid items={items} {...props} />);
};

describe('InfoGrid', () => {
  it('renders all labels', () => {
    setup();

    items.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders all values', () => {
    setup();

    items.forEach(({ value }) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('renders with custom column count', () => {
    setup({ column: 1 });

    items.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
