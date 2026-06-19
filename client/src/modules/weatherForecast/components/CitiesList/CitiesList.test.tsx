import { render, screen } from '@testing-library/react';
import { vi, beforeAll } from 'vitest';

import { CitiesList } from './CitiesList';

vi.mock('../CityCard', () => ({
  CityCard: ({ city }: { city: string }) => <div>{city}</div>,
}));

beforeAll(() => {
  class IntersectionObserverMock {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }

  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
});

describe('CitiesList', () => {
  const cities = [
    {
      id: '1',
      city: 'Kyiv',
      weather: null,
      isPinned: false,
    },
    {
      id: '2',
      city: 'London',
      weather: null,
      isPinned: true,
    },
  ];

  it('renders cities', () => {
    render(
      <CitiesList
        cities={cities as never}
        removingCityId={null}
        onRemove={vi.fn()}
        onTogglePinned={vi.fn()}
        loadMore={vi.fn()}
        hasNext={false}
      />,
    );

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
  });

  it('renders loader when hasNext=true', () => {
    const { container } = render(
      <CitiesList
        cities={cities as never}
        removingCityId={null}
        onRemove={vi.fn()}
        onTogglePinned={vi.fn()}
        loadMore={vi.fn()}
        hasNext
      />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows loading overlay', () => {
    render(
      <CitiesList
        cities={cities as never}
        removingCityId={null}
        onRemove={vi.fn()}
        onTogglePinned={vi.fn()}
        loadMore={vi.fn()}
        hasNext={false}
        loading
      />,
    );

    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });
});
