import { App as AntApp } from 'antd';
import { BrowserRouter } from 'react-router-dom';

import type { IAppModule } from '@/common/types';
import { AppApolloProvider } from '@/common/api/apollo';
import { ProviderOrder } from '@/common/providers';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';

const commonModule = {
  name: 'common',
  providers: [
    { component: AntApp, order: ProviderOrder.UiFramework },
    { component: ToastProvider, order: ProviderOrder.Toast },
    { component: AppApolloProvider, order: ProviderOrder.Apollo },
    { component: ThemeProvider, order: ProviderOrder.Theme },
    { component: BrowserRouter, order: ProviderOrder.Router },
  ],
} satisfies IAppModule;

export default commonModule;
