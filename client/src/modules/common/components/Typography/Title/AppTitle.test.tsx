import { render, screen } from '@testing-library/react';
import { AppTitle } from './AppTitle';

describe('AppTitle', () => {
  it('should render title', () => {
    render(<AppTitle>Weather</AppTitle>);

    expect(screen.getByText('Weather')).toBeInTheDocument();
  });

  it('should merge custom className', () => {
    const { container } = render(
      <AppTitle className="custom">Weather</AppTitle>,
    );

    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});
