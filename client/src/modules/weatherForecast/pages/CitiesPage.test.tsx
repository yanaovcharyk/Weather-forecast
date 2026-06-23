import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CitiesPage } from './CitiesPage';
import type { CitiesListProps } from '../components/CitiesList/CitiesList';
import type { ExistingCityLaypoutProps } from '../components/ExistingCityLayout/ExistingCityLayout';
import type { ComponentProps } from 'react';
import type { EmptyState, PageLayout } from '../../common/components';

const mockNavigate = vi.fn();
const mockToast = vi.fn();

const mockUseCitiesPaginated = vi.fn();
const mockUseSortingParams = vi.fn();
const mockUseCityActions = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/common/hooks/useToast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock('../hooks', () => ({
  useSortingParams: () => mockUseSortingParams(),

  useCityActions: (...args: unknown[]) => mockUseCityActions(...args),

  useCitiesPaginated: (...args: unknown[]) => mockUseCitiesPaginated(...args),
}));

vi.mock('../components', () => ({
  AddCityForm: () => <div>AddCityForm</div>,

  CitiesList: ({ onCityClick, cities, hasNext, loading }: CitiesListProps) => (
    <div>
      <button onClick={() => onCityClick?.('123')}>CitiesList</button>

      <div>count:{cities.length}</div>
      <div>hasNext:{String(hasNext)}</div>
      <div>loading:{String(loading)}</div>
    </div>
  ),

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

describe('CitiesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSortingParams.mockReturnValue({
      sorting: {
        sortBy: 'name',
        sortOrder: 'asc',
      },
      setSorting: vi.fn(),
      showPinnedOnly: false,
      setShowPinnedOnly: vi.fn(),
    });

    mockUseCityActions.mockReturnValue({
      handleAddCity: vi.fn(),
      handleRemoveCity: vi.fn(),
      handleTogglePinned: vi.fn(),
      handleDeleteAllCities: vi.fn(),
      isAddingCity: false,
      currentlyRemovingCityId: null,
      currentlySelectedCity: null,
      setCurrentlySelectedCity: vi.fn(),
    });
  });

  it('should render main layout with cities list', () => {
    mockUseCitiesPaginated.mockReturnValue({
      cities: [
        {
          id: '123',
          city: 'Kyiv',
          isPinned: false,
        },
      ],
      loading: false,
      loadMore: vi.fn(),
      hasNext: false,
    });

    render(<CitiesPage />);

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
    mockUseCitiesPaginated.mockReturnValue({
      cities: [],
      loading: false,
      loadMore: vi.fn(),
      hasNext: false,
    });

    render(<CitiesPage />);

    expect(screen.getByText('No cities')).toBeInTheDocument();
  });

  it('should navigate to city details page', async () => {
    const user = userEvent.setup();

    mockUseCitiesPaginated.mockReturnValue({
      cities: [
        {
          id: '123',
          city: 'Kyiv',
          isPinned: false,
        },
      ],
      loading: false,
      loadMore: vi.fn(),
      hasNext: false,
    });

    render(<CitiesPage />);

    await user.click(
      screen.getByRole('button', {
        name: 'CitiesList',
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith('/cities/123');
  });

  it('should filter pinned cities when showPinnedOnly=true', () => {
    mockUseSortingParams.mockReturnValue({
      sorting: {
        sortBy: 'name',
        sortOrder: 'asc',
      },
      setSorting: vi.fn(),
      showPinnedOnly: true,
      setShowPinnedOnly: vi.fn(),
    });

    mockUseCitiesPaginated.mockReturnValue({
      cities: [
        {
          id: '1',
          city: 'Kyiv',
          isPinned: true,
        },
        {
          id: '2',
          city: 'Lviv',
          isPinned: false,
        },
      ],
      loading: false,
      loadMore: vi.fn(),
      hasNext: false,
    });

    render(<CitiesPage />);

    expect(screen.getByText('count:1')).toBeInTheDocument();
  });

  it('should render existing city layout when city selected', () => {
    mockUseCityActions.mockReturnValue({
      handleAddCity: vi.fn(),
      handleRemoveCity: vi.fn(),
      handleTogglePinned: vi.fn(),
      handleDeleteAllCities: vi.fn(),
      isAddingCity: false,
      currentlyRemovingCityId: null,
      currentlySelectedCity: {
        id: '123',
        city: 'Kyiv',
      },
      setCurrentlySelectedCity: vi.fn(),
    });

    mockUseCitiesPaginated.mockReturnValue({
      cities: [],
      loading: false,
      loadMore: vi.fn(),
      hasNext: false,
    });

    render(<CitiesPage />);

    expect(screen.getByText('ExistingCityLayout')).toBeInTheDocument();

    expect(screen.queryByText('AddCityForm')).not.toBeInTheDocument();
  });

  it('should call back handler', async () => {
    const user = userEvent.setup();

    const setCurrentlySelectedCity = vi.fn();

    mockUseCityActions.mockReturnValue({
      handleAddCity: vi.fn(),
      handleRemoveCity: vi.fn(),
      handleTogglePinned: vi.fn(),
      handleDeleteAllCities: vi.fn(),
      isAddingCity: false,
      currentlyRemovingCityId: null,
      currentlySelectedCity: {
        id: '123',
        city: 'Kyiv',
      },
      setCurrentlySelectedCity,
    });

    mockUseCitiesPaginated.mockReturnValue({
      cities: [],
      loading: false,
      loadMore: vi.fn(),
      hasNext: false,
    });

    render(<CitiesPage />);

    await user.click(
      screen.getByRole('button', {
        name: 'Back',
      }),
    );

    expect(setCurrentlySelectedCity).toHaveBeenCalledWith(null);
  });

  it('should pass hasNext=false and loading=true', () => {
    mockUseSortingParams.mockReturnValue({
      sorting: {
        sortBy: 'name',
        sortOrder: 'asc',
      },
      setSorting: vi.fn(),
      showPinnedOnly: true,
      setShowPinnedOnly: vi.fn(),
    });

    mockUseCitiesPaginated.mockReturnValue({
      cities: [],
      loading: true,
      loadMore: vi.fn(),
      hasNext: true,
    });

    render(<CitiesPage />);

    expect(screen.getByText('hasNext:false')).toBeInTheDocument();

    expect(screen.getByText('loading:true')).toBeInTheDocument();
  });
  it('calls notification callbacks passed to useCityActions', () => {
    mockUseCityActions.mockImplementation((params) => {
      params.showSuccessNotification('success message');
      params.showErrorNotification('error message');
      params.showInfoNotification('info message');

      return {
        handleAddCity: vi.fn(),
        handleRemoveCity: vi.fn(),
        handleTogglePinned: vi.fn(),
        handleDeleteAllCities: vi.fn(),
        isAddingCity: false,
        currentlyRemovingCityId: null,
        currentlySelectedCity: null,
        setCurrentlySelectedCity: vi.fn(),
      };
    });

    mockUseCitiesPaginated.mockReturnValue({
      cities: [],
      loading: false,
      loadMore: vi.fn(),
      hasNext: false,
    });

    render(<CitiesPage />);

    expect(mockToast).toHaveBeenCalledWith('success', 'success message');

    expect(mockToast).toHaveBeenCalledWith('error', 'error message');

    expect(mockToast).toHaveBeenCalledWith('info', 'info message');
  });
});
