import { render, screen } from '@testing-library/react';

import { DataBoundary } from './DataBoundary';

vi.mock('@/common/components', () => ({
  BlurLoaderOverlay: ({
    loading,
    children,
  }: {
    loading: boolean;
    children: React.ReactNode;
  }) => (
    <div>
      <div>loading:{String(loading)}</div>
      {children}
    </div>
  ),
  ErrorPage: ({
    title,
    description,
  }: {
    title?: string;
    description?: string;
  }) => (
    <div>
      <div>{title}</div>
      <div>{description}</div>
    </div>
  ),
}));

describe('DataBoundary', () => {
  it('renders error page with fallback error description', () => {
    render(
      <DataBoundary error={new Error('Failed')} errorTitle="Oops">
        Content
      </DataBoundary>,
    );

    expect(screen.getByText('Oops')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('renders children through loader when there is no error', () => {
    render(<DataBoundary>Content</DataBoundary>);

    expect(screen.getByText('loading:false')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
