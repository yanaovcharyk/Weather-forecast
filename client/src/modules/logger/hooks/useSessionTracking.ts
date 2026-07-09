import { useEffect, useState } from 'react';
import { loggerContext } from '@/logger/context/LoggerContextStore';

export function useSessionTracking() {
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    loggerContext.set({
      sessionId,
    });

    return () => {
      loggerContext.clear();
    };
  }, [sessionId]);
}
