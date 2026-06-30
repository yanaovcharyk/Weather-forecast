import {
  LOGGER_BATCH_SIZE,
  LOGGER_FLUSH_INTERVAL_IN_MS,
} from '@/logger/constants';
import type { IClientLogRecord } from '@/logger/types';
import { GraphQLLoggerTransport } from './GraphQLLoggerTransport';
import { loggerRetryQueue } from './LoggerRetryService';
import { config } from '@/common/config';

export class LoggerQueue {
  private queuedLogs: IClientLogRecord[] = [];
  private readonly loggerTransport = new GraphQLLoggerTransport();
  private intervalId: ReturnType<typeof window.setInterval> | null = null;

  constructor(enableAutoFlush: boolean = true) {
    this.registerPageCloseListeners();

    if (enableAutoFlush) {
      this.startAutoSendScheduler();
    }
  }

  addLog(logRecord: IClientLogRecord): void {
    if (!config.loggerRemote) {
      return;
    }

    this.queuedLogs.push(logRecord);

    if (this.queuedLogs.length >= LOGGER_BATCH_SIZE) {
      this.sendQueuedLogs('batch').catch((error: unknown) => {
        console.error('Failed to send queued logs', error);
      });
    }
  }

  async sendQueuedLogs(
    mode: 'batch' | 'auto' | 'manual' = 'manual',
  ): Promise<void> {
    if (!this.queuedLogs.length || !config.loggerRemote) {
      return;
    }

    const logsToSend = [...this.queuedLogs];
    this.queuedLogs = [];

    try {
      await this.loggerTransport.send(logsToSend);
    } catch (error) {
      if (mode === 'auto') {
        console.error('Failed to auto send logs', error);
      } else {
        console.error('Failed to send queued logs', error);
      }

      await loggerRetryQueue.retryFailedBatch({
        logRecords: logsToSend,
        currentRetryAttempt: 0,
      });
    }
  }

  private startAutoSendScheduler(): void {
    if (this.intervalId) return;

    this.intervalId = window.setInterval(() => {
      if (!this.queuedLogs.length) {
        return;
      }

      this.sendQueuedLogs('auto').catch((error: unknown) => {
        console.error('Failed to auto send logs', error);
      });
    }, LOGGER_FLUSH_INTERVAL_IN_MS);
  }

  private registerPageCloseListeners(): void {
    const flush = (): void => {
      if (!this.queuedLogs.length || !config.loggerRemote) {
        return;
      }

      const logs = [...this.queuedLogs];
      this.queuedLogs = [];

      this.loggerTransport.sendOnPageClose(logs);
    };

    window.addEventListener('beforeunload', flush);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    });
  }

  public destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const loggerQueue = new LoggerQueue();
