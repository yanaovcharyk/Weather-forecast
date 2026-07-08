import type { IAppModule } from '@/common/types';
import { ProviderOrder } from '@/common/providers';
import { ErrorBoundary } from './components';
import { LoggerContextProvider, RouteLoggerProvider } from './providers';

const loggerModule: IAppModule = {
  name: 'logger',
  providers: [
    { component: ErrorBoundary, order: ProviderOrder.ErrorBoundary },
    { component: LoggerContextProvider, order: ProviderOrder.LoggerContext },
    { component: RouteLoggerProvider, order: ProviderOrder.RouteLogger },
    { component: ErrorBoundary, order: ProviderOrder.RouteErrorBoundary },
  ],
};

export default loggerModule;
