import { render, screen } from '@testing-library/react';
import { AppCard } from './AppCard';

describe('AppCard', () => {
  it('should render children', () => {
    render(<AppCard>Card Content</AppCard>);

    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should merge custom className', () => {
    const { container } = render(<AppCard className="custom">Content</AppCard>);

    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});
