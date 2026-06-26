import { createMutationMock } from '@/common/testing/mocks/mutation.mock';

export const createLogoutContext = () => ({
  mutation: createMutationMock(),
});
