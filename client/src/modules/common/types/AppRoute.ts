export type RouteGuard = 'auth' | 'guest';

export type AppRoute = {
  path: string;
  guard?: RouteGuard;
  component: React.ComponentType;
};
