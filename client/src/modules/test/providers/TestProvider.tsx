import { MemoryRouter } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { MockedProvider } from '@apollo/client/testing/react';

import { AuthContext } from '@/auth/contexts/AuthContext';
import { ToastProvider } from '@/common/providers/ToastProvider';

import { createAuthMock, type AuthContextType } from '@/test/mocks/auth.mock';

export const createTestProviders = (options?: {
  auth?: Partial<AuthContextType>;
}) => {
  const authMock = createAuthMock(options?.auth);

  return ({ children }: React.PropsWithChildren) => (
    <MockedProvider>
      <AntApp>
        <MemoryRouter>
          <AuthContext.Provider value={authMock}>
            <ToastProvider>{children}</ToastProvider>
          </AuthContext.Provider>
        </MemoryRouter>
      </AntApp>
    </MockedProvider>
  );
};
