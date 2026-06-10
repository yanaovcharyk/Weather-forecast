export function createUserServiceMock() {
  return {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    register: jest.fn(),
    createUser: jest.fn(),
    updateRefreshTokenVersion: jest.fn(),
  };
}

export type UserServiceMock = ReturnType<typeof createUserServiceMock>;
