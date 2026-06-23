import { render, screen } from '@testing-library/react';
import { BackgroundCard } from './BackgroundCard';

describe('BackgroundCard', () => {
  it('should render children', () => {
    render(<BackgroundCard>Hello</BackgroundCard>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render background image when provided', () => {
    render(
      <BackgroundCard backgroundImage="/image.jpg">Content</BackgroundCard>,
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', '/image.jpg');
  });

  it('should render skeleton placeholder when requested', () => {
    const { container } = render(
      <BackgroundCard showSkeleton>Content</BackgroundCard>,
    );

    expect(
      container.querySelector('[class*=backgroundSkeleton]'),
    ).toBeInTheDocument();
  });

  it('should not render skeleton when image exists', () => {
    const { container } = render(
      <BackgroundCard showSkeleton backgroundImage="/image.jpg">
        Content
      </BackgroundCard>,
    );

    expect(
      container.querySelector('[class*=backgroundSkeleton]'),
    ).not.toBeInTheDocument();
  });
});
