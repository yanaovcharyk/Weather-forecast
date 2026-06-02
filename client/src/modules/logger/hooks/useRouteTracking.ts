import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { loggerContext } from '../context/LoggerContextStore';
import { routerLogger } from '../loggers';

export function useRouteTracking() {
  const location = useLocation();

  const previousPath = useRef(location.pathname);

  useEffect(() => {
    loggerContext.set({
      route: location.pathname,
    });

    routerLogger.info('Route changed', {
      from: previousPath.current,
      to: location.pathname,
      search: location.search,
    });

    previousPath.current = location.pathname;
  }, [location.pathname, location.search]);
}
