import { render, screen } from '@testing-library/react';
import { StyledCard } from './StyledCard';

describe('AppCard', () => {
  it('should render children', () => {
    render(<StyledCard>Card Content</StyledCard>);

    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should merge custom className', () => {
    const { container } = render(
      <StyledCard className="custom">Content</StyledCard>,
    );

    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});
