import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { config } from '@/common/config';
import { loggerRetryQueue } from './LoggerRetryService';
import { LoggerQueue } from './LoggerQueueService';
import { createLogRecord } from '@/logger/testing/fixtures';
import type { LoggerQueueTransportMocks } from '@/logger/testing/contexts/loggerQueue.context';
import {
  advanceLoggerFlushInterval,
  setDocumentVisibility,
  setupLoggerQueueRuntime,
  type LoggerQueueRuntime,
} from '@/logger/testing/setups/loggerQueue.runtime';

const mocks = vi.hoisted(
  (): LoggerQueueTransportMocks => ({
    sendMock: vi.fn(),
    sendOnCloseMock: vi.fn(),
  }),
);

vi.mock('./GraphQLLoggerTransport', async () => {
  const { createGraphQLLoggerTransportMock } =
    await import('@/logger/testing/mocks/loggerQueue.mock');

  return {
    GraphQLLoggerTransport: createGraphQLLoggerTransportMock(mocks),
  };
});

vi.mock('./LoggerRetryService', async () => {
  const { createLoggerRetryQueueMock } =
    await import('@/logger/testing/mocks/loggerQueue.mock');

  return {
    loggerRetryQueue: createLoggerRetryQueueMock(),
  };
});

describe('LoggerQueue', () => {
  let runtime: LoggerQueueRuntime;

  beforeEach(() => {
    runtime = setupLoggerQueueRuntime(mocks);
  });

  afterEach(() => {
    runtime.destroy();
  });

  it('sends logs manually', async () => {
    runtime.queue.addLog(createLogRecord({ message: 'test' }));
    await runtime.queue.sendQueuedLogs();

    expect(mocks.sendMock).toHaveBeenCalledTimes(1);
  });

  it('does nothing when queue is empty', async () => {
    await runtime.queue.sendQueuedLogs();

    expect(mocks.sendMock).not.toHaveBeenCalled();
  });

  it('does not queue logs when remote logging is disabled', async () => {
    config.isLoggerRemote = false;

    runtime.queue.addLog(createLogRecord({ message: 'test' }));
    await runtime.queue.sendQueuedLogs();

    expect(mocks.sendMock).not.toHaveBeenCalled();
  });

  it('retries failed send', async () => {
    mocks.sendMock.mockRejectedValueOnce(new Error('fail'));

    runtime.queue.addLog(createLogRecord({ message: 'test' }));
    await runtime.queue.sendQueuedLogs();

    expect(loggerRetryQueue.retryFailedBatch).toHaveBeenCalled();
  });

  it('logs batch error', async () => {
    const error = new Error('batch error');

    mocks.sendMock.mockRejectedValueOnce(error);

    runtime.fillBatch();

    await vi.waitFor(() => {
      expect(runtime.consoleSpy).toHaveBeenCalledWith(
        'Failed to send queued logs',
        error,
      );
    });
  });

  it('auto scheduler sends logs', async () => {
    const autoQueue = runtime.createAutoQueue();

    autoQueue.addLog(createLogRecord({ message: 'x' }));

    advanceLoggerFlushInterval();
    await runtime.flushTimers();

    expect(mocks.sendMock).toHaveBeenCalledTimes(1);

    autoQueue.destroy();
  });

  it('logs scheduler error during auto flush', async () => {
    const error = new Error('scheduler error');

    mocks.sendMock.mockRejectedValueOnce(error);

    const autoQueue = runtime.createAutoQueue();

    autoQueue.addLog(createLogRecord({ message: 'x' }));

    advanceLoggerFlushInterval();
    await runtime.flushTimers();

    expect(runtime.consoleSpy).toHaveBeenCalledWith(
      'Failed to auto send logs',
      error,
    );

    autoQueue.destroy();
  });

  it('flushes on beforeunload', () => {
    runtime.queue.addLog(createLogRecord({ message: 'test' }));

    window.dispatchEvent(new Event('beforeunload'));

    expect(mocks.sendOnCloseMock).toHaveBeenCalled();
  });

  it('flushes on visibility hidden', () => {
    runtime.queue.addLog(createLogRecord({ message: 'test' }));

    setDocumentVisibility('hidden');
    document.dispatchEvent(new Event('visibilitychange'));

    expect(mocks.sendOnCloseMock).toHaveBeenCalled();
  });

  it('clears interval on destroy', () => {
    const spy = vi.spyOn(globalThis, 'clearInterval');
    const autoQueue = runtime.createAutoQueue();

    autoQueue.destroy();

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('logs addLog batch catch handler errors', async () => {
    const error = new Error('send failed');

    mocks.sendMock.mockRejectedValueOnce(error);
    vi.mocked(loggerRetryQueue.retryFailedBatch).mockRejectedValueOnce(error);

    runtime.fillBatch();

    await vi.waitFor(() => {
      expect(runtime.consoleSpy).toHaveBeenCalledWith(
        'Failed to send queued logs',
        error,
      );
    });
  });

  it('logs auto scheduler outer catch handler errors', async () => {
    const error = new Error('send failed');

    mocks.sendMock.mockRejectedValueOnce(error);
    vi.mocked(loggerRetryQueue.retryFailedBatch).mockRejectedValueOnce(error);

    const autoQueue = runtime.createAutoQueue();

    autoQueue.addLog(createLogRecord({ message: 'x' }));

    advanceLoggerFlushInterval();
    await runtime.flushTimers();

    expect(runtime.consoleSpy).toHaveBeenCalledWith(
      'Failed to auto send logs',
      error,
    );

    autoQueue.destroy();
  });

  it('does not start scheduler twice', () => {
    const setIntervalSpy = vi.spyOn(window, 'setInterval');
    const autoQueue = runtime.createAutoQueue();

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    (autoQueue as unknown as Record<string, () => void>)[
      'startAutoSendScheduler'
    ]();

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    autoQueue.destroy();
  });

  it('does not flush when page is visible', () => {
    runtime.queue.addLog(createLogRecord({ message: 'test' }));

    setDocumentVisibility('visible');
    document.dispatchEvent(new Event('visibilitychange'));

    expect(mocks.sendOnCloseMock).not.toHaveBeenCalled();
  });

  it('can create manual queue directly for coverage-sensitive paths', () => {
    const queue = new LoggerQueue(false);

    expect(queue).toBeInstanceOf(LoggerQueue);

    queue.destroy();
  });
});
