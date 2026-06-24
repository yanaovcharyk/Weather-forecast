import { createMutationMock } from '@/test/mocks/mutation.mock';

export const createLogoutContext = () => ({
  mutation: createMutationMock(),
});
