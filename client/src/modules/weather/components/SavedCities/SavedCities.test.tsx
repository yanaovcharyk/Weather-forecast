import { render, screen, within } from '@testing-library/react';

import { SavedCities } from './SavedCities';

vi.mock('@/common/components', () => ({
  StyledCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-card">{children}</div>
  ),
}));

vi.mock('@/weather/components', () => ({
  CitiesListHeader: () => <div data-testid="cities-list-header" />,
  CitiesList: () => <div data-testid="cities-list" />,
}));

describe('SavedCities', () => {
  it('renders cities header inside card and cities list', () => {
    render(<SavedCities />);

    const card = screen.getByTestId('styled-card');

    expect(within(card).getByTestId('cities-list-header')).toBeInTheDocument();

    expect(screen.getByTestId('cities-list')).toBeInTheDocument();
  });
});
