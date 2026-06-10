export function createLoggerMock() {
  return {
    child: jest.fn().mockReturnValue({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    })
  }
};

export type LoggerMock = ReturnType<typeof createLoggerMock>;
