import type { ReactNode } from 'react';
import { useRouteTracking } from '@/logger/hooks/useRouteTracking';
import { useSessionTracking } from '@/logger/hooks/useSessionTracking';

export function LoggerProvider({ children }: { children?: ReactNode }) {
  useSessionTracking();
  useRouteTracking();

  return children;
}
