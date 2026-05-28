import { useRouteLogger } from '../hooks/useRouteLogger';

export function RouteLoggerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteLogger();
  return children;
}
