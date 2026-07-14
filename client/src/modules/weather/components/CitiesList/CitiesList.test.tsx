import { render, screen } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';

import { CitiesList } from './CitiesList';
import type { City } from '@/weather/types';
import type { CityCardProps } from '@/weather/components/CityCard/CityCard';
import { mockIntersectionObserver } from '@/common/testing/mocks/browser.mock';
import {
  createCitiesPaginatedResult,
  createSortingParamsResult,
} from '@/weather/testing/mocks';

type CityCardMockProps = CityCardProps;

const hookMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  useCitiesPaginated: vi.fn(),
  useSortingParams: vi.fn(),
  toast: {
    toast: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
  searchParams: new URLSearchParams(),
  setSearchParams: vi.fn(),
}));

let cityCardProps: CityCardMockProps[] = [];
let intersectionObserver: ReturnType<typeof mockIntersectionObserver>;

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return {
    ...actual,
    useNavigate: () => hookMocks.navigate,
    useSearchParams: () => [hookMocks.searchParams, hookMocks.setSearchParams],
  };
});

vi.mock('@/weather/hooks', () => ({
  useCitiesPaginated: (...args: unknown[]) =>
    hookMocks.useCitiesPaginated(...args),
  useSortingParams: () => hookMocks.useSortingParams(),
}));

vi.mock('@/weather/components/CityCard', () => ({
  CityCard: (props: CityCardMockProps) => {
    cityCardProps.push(props);
    return <div>{props.city.cityName}</div>;
  },
}));

vi.mock('@/common/hooks', () => ({
  useToast: () => hookMocks.toast,
}));

beforeEach(() => {
  vi.clearAllMocks();

  cityCardProps = [];
  hookMocks.searchParams = new URLSearchParams();
  hookMocks.useSortingParams.mockReturnValue(createSortingParamsResult());
  hookMocks.useCitiesPaginated.mockReturnValue(
    createCitiesPaginatedResult({
      cities,
    }),
  );

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

const renderComponent = () => render(<CitiesList />);

describe('CitiesList', () => {
  it('renders city', () => {
    renderComponent();

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
  });

  it('renders empty state when there are no cities', () => {
    hookMocks.useCitiesPaginated.mockReturnValue(createCitiesPaginatedResult());

    renderComponent();

    expect(screen.getByText('No cities')).toBeInTheDocument();
  });

  it('passes only city data into CityCard', () => {
    renderComponent();

    expect(cityCardProps[0]).toEqual({ city: cities[0] });
  });

  it('filters cities by existingId search param', () => {
    hookMocks.searchParams = new URLSearchParams('existingId=1');
    hookMocks.useSortingParams.mockReturnValue(
      createSortingParamsResult({
        showPinnedOnly: true,
      }),
    );
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities: [
          cities[0],
          {
            id: '2',
            cityName: 'Lviv',
            weather: null,
            isPinned: false,
            lat: 49.84,
            lon: 24.03,
          },
        ],
      }),
    );

    renderComponent();

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(screen.queryByText('Lviv')).not.toBeInTheDocument();
    expect(screen.getByText('← Back to all cities')).toBeInTheDocument();
    expect(hookMocks.useCitiesPaginated).toHaveBeenCalledWith(
      expect.any(Object),
      false,
    );
  });

  it('creates observer and calls loadMore on intersection', () => {
    const loadMore = vi.fn();
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities,
        hasNext: true,
        loadMore,
      }),
    );

    renderComponent();

    intersectionObserver.trigger([{ isIntersecting: true }]);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('does not call loadMore when not intersecting', () => {
    const loadMore = vi.fn();
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities,
        hasNext: true,
        loadMore,
      }),
    );

    renderComponent();

    intersectionObserver.trigger([{ isIntersecting: false }]);

    expect(loadMore).not.toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities,
        hasNext: true,
      }),
    );

    const { unmount } = renderComponent();

    unmount();

    expect(intersectionObserver.disconnect).toHaveBeenCalledTimes(1);
  });

  it('does not observe load-more trigger when hasNextPage=false', () => {
    renderComponent();

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(intersectionObserver.observe).not.toHaveBeenCalled();
  });

  it('renders loading overlay', () => {
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities,
        loading: true,
      }),
    );

    renderComponent();

    const spin = document.querySelector('.ant-spin');
    expect(spin).toHaveAttribute('aria-busy', 'true');

    const row = screen.getByText('Kyiv').closest('.ant-row');
    expect(row?.className).toContain('blocked');
  });

  it('observes load-more trigger when hasNextPage=true', () => {
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities,
        hasNext: true,
      }),
    );

    renderComponent();

    expect(intersectionObserver.observe).toHaveBeenCalledTimes(1);
  });
});
