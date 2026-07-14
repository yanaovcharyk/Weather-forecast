import { screen } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

import type { CityCardProps } from '@/weather/components/CityCard/CityCard';
import {
  createCitiesPaginatedResult,
  createSortingParamsResult,
} from '@/weather/testing/mocks';
import {
  CITIES_LIST_CITY_FIXTURE,
  CITIES_LIST_EXTRA_CITY_FIXTURE,
  type CitiesListRuntimeMocks,
} from '@/weather/testing/contexts/citiesList.context';
import { setupCitiesListRuntime } from '@/weather/testing/setups/citiesList.runtime';
import { setupCitiesList } from '@/weather/testing/setups/citiesList.setup';

type CityCardMockProps = CityCardProps;

const hookMocks = vi.hoisted(
  (): CitiesListRuntimeMocks => ({
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
    cityCardProps: [],
  }),
);

let runtime: ReturnType<typeof setupCitiesListRuntime>;

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
    hookMocks.cityCardProps.push(props);
    return <div>{props.city.cityName}</div>;
  },
}));

vi.mock('@/common/hooks', () => ({
  useToast: () => hookMocks.toast,
}));

describe('CitiesList', () => {
  beforeEach(() => {
    runtime = setupCitiesListRuntime(hookMocks);
  });

  it('renders city', () => {
    setupCitiesList();

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
  });

  it('renders empty state when there are no cities', () => {
    hookMocks.useCitiesPaginated.mockReturnValue(createCitiesPaginatedResult());

    setupCitiesList();

    expect(screen.getByText('No cities')).toBeInTheDocument();
  });

  it('passes only city data into CityCard', () => {
    setupCitiesList();

    expect(hookMocks.cityCardProps[0]).toEqual({
      city: CITIES_LIST_CITY_FIXTURE,
    });
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
        cities: [CITIES_LIST_CITY_FIXTURE, CITIES_LIST_EXTRA_CITY_FIXTURE],
      }),
    );

    setupCitiesList();

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
        cities: [CITIES_LIST_CITY_FIXTURE],
        hasNext: true,
        loadMore,
      }),
    );

    setupCitiesList();
    runtime.intersectionObserver.trigger([{ isIntersecting: true }]);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('does not call loadMore when not intersecting', () => {
    const loadMore = vi.fn();
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities: [CITIES_LIST_CITY_FIXTURE],
        hasNext: true,
        loadMore,
      }),
    );

    setupCitiesList();
    runtime.intersectionObserver.trigger([{ isIntersecting: false }]);

    expect(loadMore).not.toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities: [CITIES_LIST_CITY_FIXTURE],
        hasNext: true,
      }),
    );

    const { unmount } = setupCitiesList();

    unmount();

    expect(runtime.intersectionObserver.disconnect).toHaveBeenCalledTimes(1);
  });

  it('does not observe load-more trigger when hasNextPage=false', () => {
    setupCitiesList();

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(runtime.intersectionObserver.observe).not.toHaveBeenCalled();
  });

  it('renders loading overlay', () => {
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities: [CITIES_LIST_CITY_FIXTURE],
        loading: true,
      }),
    );

    setupCitiesList();

    const spin = document.querySelector('.ant-spin');
    expect(spin).toHaveAttribute('aria-busy', 'true');

    const row = screen.getByText('Kyiv').closest('.ant-row');
    expect(row?.className).toContain('blocked');
  });

  it('observes load-more trigger when hasNextPage=true', () => {
    hookMocks.useCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities: [CITIES_LIST_CITY_FIXTURE],
        hasNext: true,
      }),
    );

    setupCitiesList();

    expect(runtime.intersectionObserver.observe).toHaveBeenCalledTimes(1);
  });
});
