export function createPasswordHasherMock() {
  return {
    hash: jest.fn(),
    validatePassword: jest.fn(),
  };
}

export type PasswordHasherMock = ReturnType<
  typeof createPasswordHasherMock
>;
