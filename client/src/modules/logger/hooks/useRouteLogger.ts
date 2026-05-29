import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '../services/LoggerService';
import { loggerContext } from '../context/LoggerContextStore';

export function useRouteLogger() {
  const location = useLocation();

  useEffect(() => {
    const context = loggerContext.get();

    logger.info('Route changed', {
      path: location.pathname,
      search: location.search,
      sessionId: context.sessionId,
      userId: context.userId,
      requestId: context.requestId,
    });
  }, [location.pathname, location.search]);
}
