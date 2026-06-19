import { createMutationMock } from '../../mocks/mutation.mock';

export const createLogoutContext = () => ({
  mutation: createMutationMock(),
});
