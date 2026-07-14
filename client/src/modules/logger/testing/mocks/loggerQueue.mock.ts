import { vi } from 'vitest';

import type { LoggerQueueTransportMocks } from '@/logger/testing/contexts/loggerQueue.context';

export const createGraphQLLoggerTransportMock = (
  mocks: LoggerQueueTransportMocks,
) =>
  class {
    send = mocks.sendMock;
    sendOnPageClose = mocks.sendOnCloseMock;
  };

export const createLoggerRetryQueueMock = () => ({
  retryFailedBatch: vi.fn(),
});
