import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { DataBoundary } from './DataBoundary';

const toast = {
  toast: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

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
}));

vi.mock('@/common/hooks', () => ({
  useToast: () => toast,
}));

describe('DataBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows toast and keeps children when there is an error', () => {
    render(
      <DataBoundary error={new Error('Failed')} errorTitle="Oops">
        Content
      </DataBoundary>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Oops');
  });

  it('renders children through loader when there is no error', () => {
    render(<DataBoundary>Content</DataBoundary>);

    expect(screen.getByText('loading:false')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders children without loader wrapper when loading overlay is disabled', () => {
    render(<DataBoundary showLoadingOverlay={false}>Content</DataBoundary>);

    expect(screen.queryByText('loading:false')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
