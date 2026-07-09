import type { IAppModule } from '@/common/types';
import { ProviderOrder } from '@/common/providers';
import { ErrorBoundary } from './components';
import { LoggerProvider } from './providers';

const loggerModule: IAppModule = {
  name: 'logger',
  providers: [
    { component: ErrorBoundary, order: ProviderOrder.ErrorBoundary },
    { component: LoggerProvider, order: ProviderOrder.RouteLogger },
    { component: ErrorBoundary, order: ProviderOrder.RouteErrorBoundary },
  ],
};

export default loggerModule;
