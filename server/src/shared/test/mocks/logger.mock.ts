export function createLoggerMock() {
  const logger: any = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
  logger.child = jest.fn().mockImplementation(() => logger);
  return logger;
}

export type LoggerMock = ReturnType<typeof createLoggerMock>;
