import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { applyGuards } from './guards';

vi.mock('./registry', () => ({
  routes: [
    {
      path: '/',
      component: () => <div>Home Page</div>,
    },
  ],
}));

vi.mock('./guards', () => ({
  applyGuards: vi.fn((_, element) => element),
}));

vi.mock('@/common/components/ErrorBoundary/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: React.PropsWithChildren) => children,
}));

const setupAppRouter = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <AppRouter />
    </MemoryRouter>,
  );

describe('AppRouter', () => {
  it('should render route component when path matches', () => {
    setupAppRouter();

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('should apply guards before rendering route', () => {
    setupAppRouter();

    expect(applyGuards).toHaveBeenCalled();
  });
});
