export function createAuthTokenServiceMock() {
  return {
    createAccessToken: jest.fn(),
    createRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    verifyAccessToken: jest.fn(),
  };
}

export type AuthTokenServiceMock = ReturnType<
  typeof createAuthTokenServiceMock
>;
