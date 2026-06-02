import { type PropsWithChildren, useEffect, useState } from 'react';
import { loggerContext } from '../context/LoggerContextStore';

export function LoggerContextProvider({ children }: PropsWithChildren) {
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    const updateContext = () => {
      loggerContext.set({
        ...loggerContext.get(),
        sessionId,
      });
    };

    updateContext();

    window.addEventListener('popstate', updateContext);

    return () => {
      window.removeEventListener('popstate', updateContext);
      loggerContext.clear();
    };
  }, [sessionId]);

  return children;
}
