export function createConfigMock() {
  return {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };
}

export type ConfigServiceMock = ReturnType<typeof createConfigMock>;
