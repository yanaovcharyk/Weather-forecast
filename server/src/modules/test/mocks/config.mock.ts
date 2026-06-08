export function createConfigMock() {
  return {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };
}
