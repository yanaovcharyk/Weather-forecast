import { logger } from './services/LoggerService';

export const apolloLogger = logger.child({
  module: 'Apollo',
});

export const errorBoundaryLogger = logger.child({
  module: 'ErrorBoundary',
});

export const routerLogger = logger.child({
  module: 'Router',
});

// export const authLogger = logger.child({
//   module: 'Auth',
// });
