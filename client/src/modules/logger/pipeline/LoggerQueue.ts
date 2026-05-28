import {
  LOGGER_BATCH_SIZE,
  LOGGER_FLUSH_INTERVAL_IN_MS,
  LOGGER_MAX_QUEUE_SIZE,
} from '../constants';
import type { ClientLogRecord } from '../types';
import { LoggerTransport } from './LoggerTransport';
import { loggerRetryQueue } from './LoggerRetryQueue';
import { loggerDeduplicator } from '../guards/LoggerDeduplicator';

export class LoggerQueue {
  private queuedLogs: ClientLogRecord[] = [];

  private readonly loggerTransport = new LoggerTransport();

  constructor() {
    this.startAutoSendScheduler();

    this.registerPageCloseListeners();
  }

  addLog(logRecord: ClientLogRecord): void {
    if (loggerDeduplicator.shouldSkipLog(logRecord)) {
      return;
    }

    if (this.queuedLogs.length >= LOGGER_MAX_QUEUE_SIZE) {
      this.removeOldestLog();
    }

    this.queuedLogs.push(logRecord);

    if (this.queuedLogs.length >= LOGGER_BATCH_SIZE) {
      void this.sendQueuedLogs();
    }
  }

  async sendQueuedLogs(): Promise<void> {
    if (this.queuedLogs.length === 0) {
      return;
    }

    const logsToSend = this.copyQueuedLogs();

    this.clearQueuedLogs();

    try {
      await this.loggerTransport.send(logsToSend);
    } catch {
      await loggerRetryQueue.retryFailedBatch({
        logRecords: logsToSend,
        currentRetryAttempt: 0,
      });
    }
  }

  private startAutoSendScheduler(): void {
    window.setInterval(() => {
      void this.sendQueuedLogs();
    }, LOGGER_FLUSH_INTERVAL_IN_MS);
  }

  private registerPageCloseListeners(): void {
    const sendLogsBeforePageClose = (): void => {
      if (this.queuedLogs.length === 0) {
        return;
      }

      const logsToSend = this.copyQueuedLogs();

      this.clearQueuedLogs();

      this.loggerTransport.sendOnPageClose(logsToSend);
    };

    window.addEventListener('beforeunload', sendLogsBeforePageClose);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendLogsBeforePageClose();
      }
    });
  }

  private clearQueuedLogs(): void {
    this.queuedLogs = [];
  }

  private copyQueuedLogs(): ClientLogRecord[] {
    return [...this.queuedLogs];
  }

  private removeOldestLog(): void {
    this.queuedLogs.shift();
  }
}

export const loggerQueue = new LoggerQueue();
