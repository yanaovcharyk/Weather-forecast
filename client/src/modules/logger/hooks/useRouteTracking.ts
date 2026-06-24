import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { loggerContext } from '@/logger/context/LoggerContextStore';
import { createLogger } from '@/logger/utils/createLogger';

export const routerLogger = createLogger('Router');

export function useRouteTracking() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    loggerContext.set({
      ...loggerContext.get(),
      route: location.pathname,
    });

    routerLogger.info('route.changed', {
      from: previousPath.current,
      to: location.pathname,
      search: location.search,
    });

    previousPath.current = location.pathname;
  }, [location.pathname, location.search]);
}
