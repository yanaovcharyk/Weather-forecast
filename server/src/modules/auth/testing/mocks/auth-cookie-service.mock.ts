export function createAuthCookieServiceMock() {
  return {
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setAccessToken: jest.fn(),
    setRefreshToken: jest.fn(),
    clearAccessToken: jest.fn(),
    clearRefreshToken: jest.fn(),
    clearAccessAndRefreshTokens: jest.fn(),
  };
}

export type AuthCookieServiceMock = ReturnType<
  typeof createAuthCookieServiceMock
>;
