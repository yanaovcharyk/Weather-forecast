import { createMutationMock } from '@/common/test/mocks/mutation.mock';

export const createLogoutContext = () => ({
  mutation: createMutationMock(),
});
