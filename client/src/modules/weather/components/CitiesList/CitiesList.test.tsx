import { render, screen } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import React from 'react';
import { CitiesList } from './CitiesList';
import type { City } from '@/weather/types';
import type { CityCardProps } from '@/weather/components/CityCard/CityCard';
import { mockIntersectionObserver } from '@/common/testing/mocks/browser.mock';

type CityCardMockProps = CityCardProps;

let cityCardProps: CityCardMockProps[] = [];
let intersectionObserver: ReturnType<typeof mockIntersectionObserver>;

vi.mock('@/weather/components/CityCard', () => ({
  CityCard: (props: CityCardMockProps) => {
    cityCardProps.push(props);
    return <div>{props.cityName}</div>;
  },
}));

beforeEach(() => {
  cityCardProps = [];

  intersectionObserver = mockIntersectionObserver();
});

const cities: City[] = [
  {
    id: '1',
    cityName: 'Kyiv',
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
  onLoadMore: vi.fn(),
  hasNextPage: false,
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
      hasNextPage: true,
      onLoadMore: loadMore,
    });

    intersectionObserver.trigger([{ isIntersecting: true }]);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('does not call loadMore when not intersecting', () => {
    const loadMore = vi.fn();

    renderComponent({
      hasNextPage: true,
      onLoadMore: loadMore,
    });

    intersectionObserver.trigger([{ isIntersecting: false }]);

    expect(loadMore).not.toHaveBeenCalled();
  });

  it('disconnects observer when infinite scroll turns off', () => {
    const { rerender } = renderComponent({
      hasNextPage: true,
    });

    rerender(<CitiesList {...defaultProps} hasNextPage={false} />);

    expect(intersectionObserver.disconnect).toHaveBeenCalledTimes(1);
  });

  it('does not observe load-more trigger when hasNextPage=false', () => {
    renderComponent({
      hasNextPage: false,
    });

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(intersectionObserver.observe).not.toHaveBeenCalled();
  });

  it('renders loading overlay', () => {
    renderComponent({
      isListLoading: true,
    });

    const spin = document.querySelector('.ant-spin');
    expect(spin).toHaveAttribute('aria-busy', 'true');

    const row = screen.getByText('Kyiv').closest('.ant-row');
    expect(row?.className).toContain('blocked');
  });

  it('observes load-more trigger when hasNextPage=true', () => {
    renderComponent({
      hasNextPage: true,
    });

    expect(intersectionObserver.observe).toHaveBeenCalledTimes(1);
  });
});
