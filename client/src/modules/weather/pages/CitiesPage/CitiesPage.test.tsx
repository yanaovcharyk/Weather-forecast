import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

import type { CitiesListProps } from '@/weather/components/CitiesList/CitiesList';
import type { ExistingCityLaypoutProps } from '@/weather/components/ExistingCityLayout/ExistingCityLayout';
import type { ComponentProps, PropsWithChildren } from 'react';
import type { EmptyState, PageLayout } from '@/common/components';
import {
  CITY_FIXTURE,
  EXISTING_CITY_FIXTURE,
} from '@/weather/testing/fixtures';
import {
  createCitiesPaginatedResult,
  createCityActionsResult,
  createSortingParamsResult,
} from '@/weather/testing/mocks';
import { renderWithUser } from '@/common/testing/render/renderWithUser';
import { CitiesPage } from './CitiesPage';

const mockNavigate = vi.fn();
const mockToast = vi.fn();

const mockUseCitiesPaginated = vi.fn();
const mockUseSortingParams = vi.fn();
const mockUseCityActions = vi.fn();

vi.mock('antd', () => ({
  Row: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Col: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Flex: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/common/hooks/useToast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock('@/weather/hooks', () => ({
  useSortingParams: () => mockUseSortingParams(),

  useCityActions: (...args: unknown[]) => mockUseCityActions(...args),

  useCitiesPaginated: (...args: unknown[]) => mockUseCitiesPaginated(...args),
}));

vi.mock('@/weather/components', () => ({
  AddCityForm: () => <div>AddCityForm</div>,

  CitiesList: ({
    onCityClick,
    cities,
    hasNextPage,
    isListLoading,
  }: CitiesListProps) => {
    const firstCity = cities[0];

    return (
      <div>
        <button onClick={() => firstCity && onCityClick?.(firstCity.id)}>
          CitiesList
        </button>

        <div>count:{cities.length}</div>
        <div>hasNextPage:{String(hasNextPage)}</div>
        <div>isListLoading:{String(isListLoading)}</div>
      </div>
    );
  },

  CitiesControls: () => <div>CitiesControls</div>,

  ExistingCityLayout: ({ onBack }: ExistingCityLaypoutProps) => (
    <div>
      ExistingCityLayout
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock('@/common/components', () => ({
  EmptyState: ({ description }: ComponentProps<typeof EmptyState>) => (
    <div>{description}</div>
  ),

  AppCard: ({ children }: React.PropsWithChildren) => <div>{children}</div>,

  PageLayout: ({ children, header }: ComponentProps<typeof PageLayout>) => (
    <div>
      {header}
      {children}
    </div>
  ),

  Header: () => <div>Header</div>,

  ScrollToTopButton: () => <div>ScrollToTop</div>,
}));

const setup = () => renderWithUser(<CitiesPage />);

describe('CitiesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSortingParams.mockReturnValue(createSortingParamsResult());
    mockUseCityActions.mockReturnValue(createCityActionsResult());
    mockUseCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities: [CITY_FIXTURE],
      }),
    );
  });

  it('should render main layout with cities list', () => {
    setup();

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('AddCityForm')).toBeInTheDocument();
    expect(screen.getByText('CitiesControls')).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'CitiesList',
      }),
    ).toBeInTheDocument();

    expect(screen.getByText('ScrollToTop')).toBeInTheDocument();
  });

  it('should show empty state when no cities', () => {
    mockUseCitiesPaginated.mockReturnValue(createCitiesPaginatedResult());

    setup();

    expect(screen.getByText('No cities')).toBeInTheDocument();
  });

  it('should navigate to city details page', async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole('button', {
        name: 'CitiesList',
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(`/cities/${CITY_FIXTURE.id}`);
  });

  it('should filter pinned cities when showPinnedOnly=true', () => {
    mockUseSortingParams.mockReturnValue(
      createSortingParamsResult({
        showPinnedOnly: true,
      }),
    );
    mockUseCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        cities: [EXISTING_CITY_FIXTURE, CITY_FIXTURE],
      }),
    );

    setup();

    expect(screen.getByText('count:1')).toBeInTheDocument();
  });

  it('should render existing city layout when city selected', () => {
    mockUseCityActions.mockReturnValue(
      createCityActionsResult({
        currentlySelectedCity: CITY_FIXTURE,
      }),
    );

    setup();

    expect(screen.getByText('ExistingCityLayout')).toBeInTheDocument();

    expect(screen.queryByText('AddCityForm')).not.toBeInTheDocument();
  });

  it('should call back handler', async () => {
    const clearExistingCitySelection = vi.fn();

    mockUseCityActions.mockReturnValue(
      createCityActionsResult({
        currentlySelectedCity: CITY_FIXTURE,
        clearExistingCitySelection,
      }),
    );

    const { user } = setup();

    await user.click(
      screen.getByRole('button', {
        name: 'Back',
      }),
    );

    expect(clearExistingCitySelection).toHaveBeenCalledTimes(1);
  });

  it('should pass hasNextPage and isListLoading states', () => {
    mockUseSortingParams.mockReturnValue(
      createSortingParamsResult({
        showPinnedOnly: true,
      }),
    );
    mockUseCitiesPaginated.mockReturnValue(
      createCitiesPaginatedResult({
        loading: true,
        hasNext: true,
      }),
    );

    setup();

    expect(screen.getByText('hasNextPage:true')).toBeInTheDocument();

    expect(screen.getByText('isListLoading:true')).toBeInTheDocument();
  });
  it('calls notification callbacks passed to useCityActions', () => {
    mockUseCityActions.mockImplementation((params) => {
      params.showSuccessNotification('success message');
      params.showErrorNotification('error message');
      params.showInfoNotification('info message');

      return createCityActionsResult();
    });

    setup();

    expect(mockToast).toHaveBeenCalledWith('success', 'success message');

    expect(mockToast).toHaveBeenCalledWith('error', 'error message');

    expect(mockToast).toHaveBeenCalledWith('info', 'info message');
  });
});
