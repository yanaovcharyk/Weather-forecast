import { useRouteTracking } from '../hooks/useRouteTracking';

export function RouteLoggerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteTracking();
  return children;
}
