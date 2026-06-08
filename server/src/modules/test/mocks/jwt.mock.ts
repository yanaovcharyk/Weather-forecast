export function createJwtMock() {
  return {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };
}
