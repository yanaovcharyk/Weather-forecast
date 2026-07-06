export function createUserServiceMock() {
  return {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findAuthByUserId: jest.fn(),
    createUserWithPassword: jest.fn(),
    create: jest.fn(),
    incrementRefreshTokenVersion: jest.fn(),
  };
}

export type UserServiceMock = ReturnType<typeof createUserServiceMock>;
