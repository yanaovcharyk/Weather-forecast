import type { AppRoute } from '@/common/types';
import { PrivateRoute } from './PrivateRoute';

export const applyGuards = (route: AppRoute, element: React.ReactElement) => {
  switch (route.guard) {
    case 'auth':
      return <PrivateRoute>{element}</PrivateRoute>;

    case 'guest':
    default:
      return element;
  }
};
