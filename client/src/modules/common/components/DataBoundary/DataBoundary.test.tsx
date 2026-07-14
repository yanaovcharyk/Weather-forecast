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

type DataBoundarySetupProps = Omit<
  React.ComponentProps<typeof DataBoundary>,
  'children'
> & {
  children?: React.ReactNode;
};

const setup = ({
  children = 'Content',
  ...props
}: DataBoundarySetupProps = {}) =>
  render(<DataBoundary {...props}>{children}</DataBoundary>);

describe('DataBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows toast and keeps children when there is an error', () => {
    setup({
      error: new Error('Failed'),
      errorTitle: 'Oops',
    });

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Oops');
  });

  it('falls back to error message when no error text is provided', () => {
    setup({
      error: new Error('Failed'),
    });

    expect(toast.error).toHaveBeenCalledWith('Failed');
  });

  it('renders children through loader when there is no error', () => {
    setup();

    expect(screen.getByText('loading:false')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders children without loader wrapper when loading overlay is disabled', () => {
    setup({
      showLoadingOverlay: false,
    });

    expect(screen.queryByText('loading:false')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
