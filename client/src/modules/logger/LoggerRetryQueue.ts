import { LOGGER_MAX_RETRY_COUNT, LOGGER_RETRY_DELAY_IN_MS } from './constants';

import type { ClientLogRecord } from './types';

import { LoggerTransport } from './LoggerTransport';

/**
 * Retry task.
 */
interface FailedLogBatchRetryTask {
  logRecords: ClientLogRecord[];

  currentRetryAttempt: number;
}

/**
 * Retry queue для failed requests.
 */
export class LoggerRetryQueue {
  private readonly loggerTransport = new LoggerTransport();

  /**
   * Retry failed log batch.
   */
  async retryFailedBatch(retryTask: FailedLogBatchRetryTask): Promise<void> {
    if (retryTask.currentRetryAttempt >= LOGGER_MAX_RETRY_COUNT) {
      console.error('Logs permanently dropped', retryTask.logRecords);

      return;
    }

    await this.waitBeforeRetry(LOGGER_RETRY_DELAY_IN_MS);

    try {
      await this.loggerTransport.send(retryTask.logRecords);
    } catch {
      await this.retryFailedBatch({
        logRecords: retryTask.logRecords,

        currentRetryAttempt: retryTask.currentRetryAttempt + 1,
      });
    }
  }

  /**
   * Delay helper.
   */
  private waitBeforeRetry(delayInMilliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delayInMilliseconds);
    });
  }
}

export const loggerRetryQueue = new LoggerRetryQueue();
