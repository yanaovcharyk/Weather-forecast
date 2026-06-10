export function createJwtMock() {
  return {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };
}

export type JwtMock = ReturnType<typeof createJwtMock>;
