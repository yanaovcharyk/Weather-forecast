import { MockedProvider } from '@apollo/client/testing/react';
import { MemoryRouter } from 'react-router-dom';

export const createUseLoginWrapper = () => {
  return ({ children }: React.PropsWithChildren) => (
    <MockedProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </MockedProvider>
  );
};
