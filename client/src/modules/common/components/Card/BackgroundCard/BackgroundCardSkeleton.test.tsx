import { render } from '@testing-library/react';
import { BackgroundCardSkeleton } from './BackgroundCardSkeleton';

describe('BackgroundCardSkeleton', () => {
  it('should render skeleton card', () => {
    const { container } = render(<BackgroundCardSkeleton />);

    expect(container).toBeInTheDocument();
  });

  it('should hide header when hasHeader is false', () => {
    const { container } = render(<BackgroundCardSkeleton hasHeader={false} />);

    expect(
      container.querySelector('.ant-skeleton-input'),
    ).not.toBeInTheDocument();
  });
});
