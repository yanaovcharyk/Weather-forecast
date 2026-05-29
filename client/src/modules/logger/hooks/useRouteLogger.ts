import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '../services/LoggerService';

export function useRouteLogger() {
  const location = useLocation();

  useEffect(() => {
    logger.info('Route changed', {
      path: location.pathname,
      search: location.search,
    });
  }, [location.pathname, location.search]);
}
