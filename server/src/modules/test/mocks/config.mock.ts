export function createConfigMock() {
  return {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  }
};

export type ConfigMock = ReturnType<typeof createConfigMock>;
