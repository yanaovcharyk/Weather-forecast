import { render, screen } from '@testing-library/react';
import { AppEmpty } from './EmptyState';

describe('AppEmpty', () => {
  it('should render default description', () => {
    render(<AppEmpty />);

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('should render custom description', () => {
    render(<AppEmpty description="Nothing here" />);

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('should render empty image', () => {
    render(<AppEmpty />);

    expect(screen.getByAltText('empty')).toBeInTheDocument();
  });
});
