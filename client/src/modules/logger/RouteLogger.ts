import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { logger } from './Logger';

export function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    logger.info('Route changed', {
      path: location.pathname,
      search: location.search,
    });
  }, [location.pathname, location.search]);

  return null;
}
