import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoggerRetryQueue } from './LoggerRetryService';
import { createLogRecord } from '@/logger/test/fixtures';

const mocks = vi.hoisted(() => ({
  sendMock: vi.fn(),
}));

vi.mock('./GraphQLLoggerTransport', () => ({
  GraphQLLoggerTransport: class {
    send = mocks.sendMock;
  },
}));

describe('LoggerRetryQueue', () => {
  let queue: LoggerRetryQueue;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    queue = new LoggerRetryQueue();
  });

  it('retries failed batch', async () => {
    mocks.sendMock
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(undefined);

    const promise = queue.retryFailedBatch({
      logRecords: [createLogRecord({ message: 'x' })],
      currentRetryAttempt: 0,
    });

    await vi.runAllTimersAsync();
    await promise;

    expect(mocks.sendMock).toHaveBeenCalledTimes(2);
  });

  it('drops logs after max retries', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await queue.retryFailedBatch({
      logRecords: [createLogRecord({ message: 'x' })],
      currentRetryAttempt: 999,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Logs permanently dropped', [
      {
        message: 'x',
        level: 'info',
        timestamp: expect.any(String),
      },
    ]);
  });
});
