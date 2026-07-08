import type { ReactNode } from 'react';
import { useRouteTracking } from '@/logger/hooks/useRouteTracking';

export function RouteLoggerProvider({ children }: { children?: ReactNode }) {
  useRouteTracking();
  return children;
}
