export function createLoggerMock() {
  const mock = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
  return {
    ...mock,
    child: jest.fn().mockReturnValue(mock),
  };
}


export type LoggerMock = ReturnType<typeof createLoggerMock>;
