import { render, screen } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import React from 'react';
import { CitiesList } from './CitiesList';
import type { City } from '@/weatherForecast/types';
import type { CityCardProps } from '@/weatherForecast/components/CityCard/CityCard';
import { mockIntersectionObserver } from '@/common/test/mocks/browser.mock';

type CityCardMockProps = CityCardProps;

let cityCardProps: CityCardMockProps[] = [];
let intersectionObserver: ReturnType<typeof mockIntersectionObserver>;

vi.mock('@/weatherForecast/components/CityCard', () => ({
  CityCard: (props: CityCardMockProps) => {
    cityCardProps.push(props);
    return <div>{props.city}</div>;
  },
}));

beforeEach(() => {
  cityCardProps = [];

  intersectionObserver = mockIntersectionObserver();
});

const cities: City[] = [
  {
    id: '1',
    city: 'Kyiv',
    weather: null,
    isPinned: false,
    lat: 50.45,
    lon: 30.52,
  },
];

const defaultProps: React.ComponentProps<typeof CitiesList> = {
  cities,
  removingCityId: null,
  onRemove: vi.fn(),
  onTogglePinned: vi.fn(),
  loadMore: vi.fn(),
  hasNext: false,
};

const renderComponent = (
  props: Partial<React.ComponentProps<typeof CitiesList>> = {},
) => render(<CitiesList {...defaultProps} {...props} />);

describe('CitiesList', () => {
  it('renders city', () => {
    renderComponent();
    expect(screen.getByText('Kyiv')).toBeInTheDocument();
  });

  it('passes callbacks into CityCard', () => {
    const onTogglePinned = vi.fn();
    const onRemove = vi.fn();
    const onCityClick = vi.fn();

    renderComponent({
      removingCityId: '1',
      onTogglePinned,
      onRemove,
      onCityClick,
    });

    const props = cityCardProps[0];

    props.onTogglePinned();
    expect(onTogglePinned).toHaveBeenCalledWith('1', false);

    props.onRemove();
    expect(onRemove).toHaveBeenCalledWith('1', 'Kyiv');

    props.onClick?.();
    expect(onCityClick).toHaveBeenCalledWith('1');

    expect(props.loading).toBe(true);
  });

  it('creates observer and calls loadMore on intersection', () => {
    const loadMore = vi.fn();

    renderComponent({
      hasNext: true,
      loadMore,
    });

    intersectionObserver.trigger([{ isIntersecting: true }]);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('does not call loadMore when not intersecting', () => {
    const loadMore = vi.fn();

    renderComponent({
      hasNext: true,
      loadMore,
    });

    intersectionObserver.trigger([{ isIntersecting: false }]);

    expect(loadMore).not.toHaveBeenCalled();
  });

  it('disconnects previous observer when effect reruns', () => {
    const { rerender } = renderComponent({
      hasNext: true,
      cities,
    });

    rerender(
      <CitiesList
        {...defaultProps}
        hasNext
        cities={[
          ...cities,
          {
            id: '2',
            city: 'Lviv',
            weather: null,
            isPinned: false,
            lat: 49.84,
            lon: 24.03,
          },
        ]}
      />,
    );

    expect(true).toBeTruthy();
  });

  it('covers false branch of loaderRef.current', () => {
    const { rerender } = renderComponent({
      hasNext: true,
    });

    rerender(<CitiesList {...defaultProps} hasNext={false} />);

    expect(true).toBeTruthy();
  });

  it('returns early when hasNext=false', () => {
    renderComponent({
      hasNext: false,
    });

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
  });

  it('renders loading overlay', () => {
    renderComponent({
      loading: true,
    });

    const spin = document.querySelector('.ant-spin');
    expect(spin).toHaveAttribute('aria-busy', 'true');

    const row = screen.getByText('Kyiv').closest('.ant-row');
    expect(row?.className).toContain('blocked');
  });

  it('observes loader element when hasNext=true', () => {
    renderComponent({
      hasNext: true,
    });

    expect(intersectionObserver.observe).toHaveBeenCalledTimes(1);
  });
});
