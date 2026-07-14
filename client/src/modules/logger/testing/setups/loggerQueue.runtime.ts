import { vi, type MockInstance } from 'vitest';

import { config } from '@/common/config';
import {
  LOGGER_BATCH_SIZE,
  LOGGER_FLUSH_INTERVAL_IN_MS,
} from '@/logger/constants';
import { LoggerQueue } from '@/logger/services/LoggerQueueService';
import { createLogRecord } from '@/logger/testing/fixtures';
import type { LoggerQueueTransportMocks } from '@/logger/testing/contexts/loggerQueue.context';

export type LoggerQueueRuntime = {
  queue: LoggerQueue;
  consoleSpy: MockInstance;
  fillBatch: (queueOverride?: LoggerQueue) => void;
  flushTimers: () => Promise<void>;
  createAutoQueue: () => LoggerQueue;
  destroy: () => void;
};

export const setupLoggerQueueRuntime = (
  mocks: LoggerQueueTransportMocks,
): LoggerQueueRuntime => {
  vi.useFakeTimers();
  vi.clearAllMocks();

  config.isLoggerRemote = true;

  const queue = new LoggerQueue(false);
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  return {
    queue,
    consoleSpy,
    fillBatch: (queueOverride = queue) => {
      for (let i = 0; i < LOGGER_BATCH_SIZE; i++) {
        queueOverride.addLog(createLogRecord({ message: `log-${i}` }));
      }
    },
    flushTimers: async () => {
      await vi.runOnlyPendingTimersAsync();
    },
    createAutoQueue: () => new LoggerQueue(true),
    destroy: () => {
      queue.destroy();
      vi.useRealTimers();
      consoleSpy.mockRestore();
      mocks.sendMock.mockReset();
      mocks.sendOnCloseMock.mockReset();
    },
  };
};

export const advanceLoggerFlushInterval = () => {
  vi.advanceTimersByTime(LOGGER_FLUSH_INTERVAL_IN_MS);
};

export const setDocumentVisibility = (
  visibilityState: 'hidden' | 'visible',
) => {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    value: visibilityState,
  });
};
