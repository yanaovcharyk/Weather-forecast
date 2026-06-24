import {
  LOGGER_MAX_RETRY_COUNT,
  LOGGER_RETRY_DELAY_IN_MS,
} from '@/logger/constants';
import type { IClientLogRecord } from '@/logger/types';
import { GraphQLLoggerTransport } from './GraphQLLoggerTransport';

interface FailedLogBatchRetryTask {
  logRecords: IClientLogRecord[];
  currentRetryAttempt: number;
}

export class LoggerRetryQueue {
  private readonly loggerTransport = new GraphQLLoggerTransport();

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

  private waitBeforeRetry(delayInMilliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delayInMilliseconds);
    });
  }
}

export const loggerRetryQueue = new LoggerRetryQueue();
