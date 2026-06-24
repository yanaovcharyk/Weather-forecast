import type { PropsWithChildren } from 'react';

vi.mock('./PrivateRoute', () => ({
  PrivateRoute: ({ children }: PropsWithChildren) => (
    <div data-testid="private-route">{children}</div>
  ),
}));
import { render } from '@testing-library/react';
import { applyGuards } from './guards';
import type { AppRoute } from '@/common/types';

describe('applyGuards', () => {
  const element = <div>Protected</div>;

  it('should wrap element with PrivateRoute when guard is auth', () => {
    const route: AppRoute = {
      path: '/',
      component: vi.fn(),
      guard: 'auth',
    };

    const result = applyGuards(route, element);

    const { getByTestId } = render(result);

    expect(getByTestId('private-route')).toBeInTheDocument();
  });

  it('should return original element when guard is guest', () => {
    const route: AppRoute = {
      path: '/',
      component: vi.fn(),
      guard: 'guest',
    };

    const result = applyGuards(route, element);

    const { getByText } = render(result);

    expect(getByText('Protected')).toBeInTheDocument();
  });

  it('should return original element when guard is undefined', () => {
    const route: AppRoute = {
      path: '/',
      component: vi.fn(),
    };
    const result = applyGuards(route, element);

    const { getByText } = render(result);

    expect(getByText('Protected')).toBeInTheDocument();
  });
});
