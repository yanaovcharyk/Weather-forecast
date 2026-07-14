import type { IAppModule } from '@/common/types';
import { ProviderOrder } from '@/common/providers';
import { ErrorBoundary, LoggerError } from './components';
import { LoggerProvider } from './providers';

const loggerModule: IAppModule = {
  name: 'logger',
  providers: [
    { component: LoggerError, order: ProviderOrder.ErrorBoundary },
    { component: LoggerProvider, order: ProviderOrder.RouteLogger },
    { component: ErrorBoundary, order: ProviderOrder.RouteErrorBoundary },
  ],
};

export default loggerModule;
