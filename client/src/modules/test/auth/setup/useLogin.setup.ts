import { createUseLoginMocks } from '../mocks/useLogin.mocks';

export const createUseLoginTestContext = () => {
  const mocks = createUseLoginMocks();

  return {
    ...mocks,
  };
};
