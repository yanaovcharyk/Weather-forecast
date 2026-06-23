import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { applyGuards } from './guards';

vi.mock('./registry', () => ({
  registry: [
    {
      routes: [
        {
          path: '/',
          component: () => <div>Home Page</div>,
        },
      ],
    },
  ],
}));

vi.mock('./guards', () => ({
  applyGuards: vi.fn((_, element) => element),
}));

vi.mock('../../../logger/components/ErrorBoundary/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: React.PropsWithChildren) => children,
}));

describe('AppRouter', () => {
  it('should render route component when path matches', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>,
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('should apply guards before rendering route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>,
    );

    expect(applyGuards).toHaveBeenCalled();
  });
});
