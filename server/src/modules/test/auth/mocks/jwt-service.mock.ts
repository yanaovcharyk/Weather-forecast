export function createJwtServiceMock() {
  return {
    verifyAsync: jest.fn(),
    verify: jest.fn(),
    sign: jest.fn(),
    signAsync: jest.fn(),
    decode: jest.fn(),
  };
}

export type JwtServiceMock = ReturnType<typeof createJwtServiceMock>;
