import { type PropsWithChildren, useEffect, useState } from 'react';
import { loggerContext } from './LoggerContextStore';

type Props = PropsWithChildren<{
  userId?: string | null;
}>;

export function LoggerContextProvider({ children, userId }: Props) {
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    const updateContext = () => {
      loggerContext.set({
        userId: userId ?? undefined,
        sessionId,
        route: window.location.pathname,
      });
    };

    updateContext();

    window.addEventListener('popstate', updateContext);

    return () => {
      window.removeEventListener('popstate', updateContext);
      loggerContext.clear();
    };
  }, [userId, sessionId]);

  return children;
}
