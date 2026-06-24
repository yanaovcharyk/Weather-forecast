import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ExistingCityLayout } from './ExistingCityLayout';
import type { City } from '@/weatherForecast/types';
import type { CitiesListProps } from '@/weatherForecast/components/CitiesList/CitiesList';

let citiesListProps: CitiesListProps | null = null;

vi.mock('@/weatherForecast/components/CitiesList', () => ({
  CitiesList: (props: CitiesListProps) => {
    citiesListProps = props;
    return <div>Mock CitiesList</div>;
  },
}));

describe('ExistingCityLayout', () => {
  const city = {
    id: '1',
    city: 'Kyiv',
    weather: null,
    isPinned: false,
  };

  beforeEach(() => {
    citiesListProps = null;
  });

  it('passes loading=false when loading=false', () => {
    render(
      <ExistingCityLayout
        existingCity={city as City}
        onBack={vi.fn()}
        removingId={null}
        onRemove={vi.fn()}
        onTogglePinned={vi.fn()}
        loading={false}
        onCityClick={vi.fn()}
      />,
    );

    expect(citiesListProps?.loading).toBe(false);
  });

  it('passes loading=false when loading=true but existingCity exists', () => {
    render(
      <ExistingCityLayout
        existingCity={city as City}
        onBack={vi.fn()}
        removingId={null}
        onRemove={vi.fn()}
        onTogglePinned={vi.fn()}
        loading={true}
        onCityClick={vi.fn()}
      />,
    );

    expect(citiesListProps?.loading).toBe(false);
  });

  it('renders back button', () => {
    render(
      <ExistingCityLayout
        existingCity={city as City}
        onBack={vi.fn()}
        removingId={null}
        onRemove={vi.fn()}
        onTogglePinned={vi.fn()}
        loading={false}
        onCityClick={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('button', { name: /back to all cities/i }),
    ).toBeInTheDocument();
  });

  it('calls onBack', async () => {
    const user = userEvent.setup();

    const onBack = vi.fn();

    render(
      <ExistingCityLayout
        existingCity={city as City}
        onBack={onBack}
        removingId={null}
        onRemove={vi.fn()}
        onTogglePinned={vi.fn()}
        loading={false}
        onCityClick={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole('button', {
        name: /back to all cities/i,
      }),
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders cities list', () => {
    render(
      <ExistingCityLayout
        existingCity={city as City}
        onBack={vi.fn()}
        removingId={null}
        onRemove={vi.fn()}
        onTogglePinned={vi.fn()}
        loading={false}
        onCityClick={vi.fn()}
      />,
    );

    expect(screen.getByText('Mock CitiesList')).toBeInTheDocument();
  });

  it('executes loadMore callback', () => {
    render(
      <ExistingCityLayout
        existingCity={city as City}
        onBack={vi.fn()}
        removingId={null}
        onRemove={vi.fn()}
        onTogglePinned={vi.fn()}
        loading={false}
        onCityClick={vi.fn()}
      />,
    );

    citiesListProps?.loadMore();
  });
});
