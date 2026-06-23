import { render, screen } from '@testing-library/react';
import { Shadow } from './Shadow';

describe('Shadow', () => {
  it('should render children', () => {
    render(
      <Shadow>
        <div>Content</div>
      </Shadow>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Shadow className="custom">Content</Shadow>);

    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});
