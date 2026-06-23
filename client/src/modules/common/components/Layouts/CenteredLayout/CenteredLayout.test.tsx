import { render, screen } from '@testing-library/react';
import { CenteredLayout } from './CenteredLayout';

describe('CenteredLayout', () => {
  it('should render children', () => {
    render(
      <CenteredLayout>
        <div>Content</div>
      </CenteredLayout>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
