import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockInstance,
} from 'vitest';
import { LoggerQueue } from './LoggerQueueService';
import {
  LOGGER_BATCH_SIZE,
  LOGGER_FLUSH_INTERVAL_IN_MS,
} from '@/logger/constants';
import { loggerRetryQueue } from './LoggerRetryService';
import { createLogRecord } from '@/logger/testing/fixtures';

const mocks = vi.hoisted(() => ({
  sendMock: vi.fn(),
  sendOnCloseMock: vi.fn(),
}));

vi.mock('./GraphQLLoggerTransport', () => ({
  GraphQLLoggerTransport: class {
    send = mocks.sendMock;
    sendOnPageClose = mocks.sendOnCloseMock;
  },
}));

vi.mock('./LoggerRetryService', () => ({
  loggerRetryQueue: {
    retryFailedBatch: vi.fn(),
  },
}));

describe('LoggerQueue', () => {
  let queue: LoggerQueue;
  let consoleSpy: MockInstance;

  const fillBatch = () => {
    for (let i = 0; i < LOGGER_BATCH_SIZE; i++) {
      queue.addLog(createLogRecord({ message: `log-${i}` }));
    }
  };

  const flush = () => vi.runOnlyPendingTimersAsync();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    queue = new LoggerQueue(false);

    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    queue.destroy();
    vi.useRealTimers();
    consoleSpy.mockRestore();
  });

  it('sends logs manually', async () => {
    queue.addLog(createLogRecord({ message: 'test' }));
    await queue.sendQueuedLogs();

    expect(mocks.sendMock).toHaveBeenCalledTimes(1);
  });

  it('does nothing when queue is empty', async () => {
    await queue.sendQueuedLogs();

    expect(mocks.sendMock).not.toHaveBeenCalled();
  });

  it('retries failed send', async () => {
    mocks.sendMock.mockRejectedValueOnce(new Error('fail'));

    queue.addLog(createLogRecord({ message: 'test' }));
    await queue.sendQueuedLogs();

    expect(loggerRetryQueue.retryFailedBatch).toHaveBeenCalled();
  });

  it('logs batch error', async () => {
    const error = new Error('batch error');

    mocks.sendMock.mockRejectedValueOnce(error);

    fillBatch();
    await queue.sendQueuedLogs();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to send queued logs',
      error,
    );
  });

  it('auto scheduler sends logs', async () => {
    const autoQueue = new LoggerQueue(true);

    autoQueue.addLog(createLogRecord({ message: 'x' }));

    vi.advanceTimersByTime(LOGGER_FLUSH_INTERVAL_IN_MS);
    await flush();

    expect(mocks.sendMock).toHaveBeenCalledTimes(1);

    autoQueue.destroy();
  });

  it('logs scheduler error (auto flush)', async () => {
    const error = new Error('scheduler error');

    mocks.sendMock.mockRejectedValueOnce(error);

    const autoQueue = new LoggerQueue(true);

    autoQueue.addLog(createLogRecord({ message: 'x' }));

    vi.advanceTimersByTime(LOGGER_FLUSH_INTERVAL_IN_MS);
    await flush();

    expect(consoleSpy).toHaveBeenCalledWith('Failed to auto send logs', error);

    autoQueue.destroy();
  });

  it('flushes on beforeunload', () => {
    queue.addLog(createLogRecord({ message: 'test' }));

    window.dispatchEvent(new Event('beforeunload'));

    expect(mocks.sendOnCloseMock).toHaveBeenCalled();
  });

  it('flushes on visibility hidden', () => {
    queue.addLog(createLogRecord({ message: 'test' }));

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    });

    document.dispatchEvent(new Event('visibilitychange'));

    expect(mocks.sendOnCloseMock).toHaveBeenCalled();
  });

  it('clears interval on destroy', () => {
    const spy = vi.spyOn(globalThis, 'clearInterval');

    const autoQueue = new LoggerQueue(true);

    autoQueue.destroy();

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('covers batch error console (line 24)', async () => {
    const error = new Error('batch fail');

    mocks.sendMock.mockRejectedValueOnce(error);

    const q = new LoggerQueue(false);

    for (let i = 0; i < LOGGER_BATCH_SIZE; i++) {
      q.addLog(createLogRecord({ message: `log-${i}` }));
    }

    await vi.runOnlyPendingTimersAsync();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to send queued logs',
      error,
    );
  });

  it('covers auto scheduler error console (line 60)', async () => {
    const error = new Error('auto fail');

    mocks.sendMock.mockRejectedValueOnce(error);

    const q = new LoggerQueue(true);

    q.addLog(createLogRecord({ message: 'x' }));

    vi.advanceTimersByTime(LOGGER_FLUSH_INTERVAL_IN_MS);

    await vi.runOnlyPendingTimersAsync();

    expect(consoleSpy).toHaveBeenCalledWith('Failed to auto send logs', error);

    q.destroy();
  });

  it('covers addLog batch catch handler', async () => {
    const error = new Error('send failed');

    mocks.sendMock.mockRejectedValueOnce(error);

    vi.mocked(loggerRetryQueue.retryFailedBatch).mockRejectedValueOnce(error);

    for (let i = 0; i < LOGGER_BATCH_SIZE; i++) {
      queue.addLog(createLogRecord({ message: `log-${i}` }));
    }

    await Promise.resolve();
    await Promise.resolve();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to send queued logs',
      error,
    );
  });

  it('covers auto scheduler outer catch handler', async () => {
    const error = new Error('send failed');

    mocks.sendMock.mockRejectedValueOnce(error);

    vi.mocked(loggerRetryQueue.retryFailedBatch).mockRejectedValueOnce(error);

    const q = new LoggerQueue(true);

    q.addLog(createLogRecord({ message: 'x' }));

    vi.advanceTimersByTime(LOGGER_FLUSH_INTERVAL_IN_MS);
    await vi.runOnlyPendingTimersAsync();

    expect(consoleSpy).toHaveBeenCalledWith('Failed to auto send logs', error);

    q.destroy();
  });

  it('does not start scheduler twice', () => {
    const setIntervalSpy = vi.spyOn(window, 'setInterval');

    const q = new LoggerQueue(true);

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    (q as unknown as Record<string, () => void>)['startAutoSendScheduler']();

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    q.destroy();
  });

  it('does not flush when page is visible', () => {
    queue.addLog(createLogRecord({ message: 'test' }));

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });

    document.dispatchEvent(new Event('visibilitychange'));

    expect(mocks.sendOnCloseMock).not.toHaveBeenCalled();
  });
});
