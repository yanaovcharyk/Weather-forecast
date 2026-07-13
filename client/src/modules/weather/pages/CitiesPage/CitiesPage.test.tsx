import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

import type { ComponentProps, PropsWithChildren } from 'react';
import type { PageLayout } from '@/common/components';
import { renderWithUser } from '@/common/testing/render/renderWithUser';
import { CitiesPage } from './CitiesPage';

vi.mock('antd', () => ({
  Row: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Col: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Flex: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

vi.mock('@/weather/components', () => ({
  AddCityForm: () => <div>AddCityForm</div>,
  SavedCities: () => <div>SavedCities</div>,
}));

vi.mock('@/common/components', () => ({
  AppCard: ({ children }: React.PropsWithChildren) => <div>{children}</div>,

  PageLayout: ({ children, header }: ComponentProps<typeof PageLayout>) => (
    <div>
      {header}
      {children}
    </div>
  ),

  Header: () => <div>Header</div>,

  ScrollToTopButton: () => <div>ScrollToTop</div>,
}));

const setup = () => renderWithUser(<CitiesPage />);

describe('CitiesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render main layout with cities list', () => {
    setup();

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('AddCityForm')).toBeInTheDocument();
    expect(screen.getByText('SavedCities')).toBeInTheDocument();

    expect(screen.getByText('ScrollToTop')).toBeInTheDocument();
  });
});
