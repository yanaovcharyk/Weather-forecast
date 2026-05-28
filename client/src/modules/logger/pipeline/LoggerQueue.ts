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
  private pendingLogRecords: ClientLogRecord[] = [];
  private readonly loggerTransport = new LoggerTransport();

  constructor() {
    this.startAutomaticFlushScheduler();

    this.registerPageCloseListeners();
  }
  addLogRecord(logRecord: ClientLogRecord): void {
    if (loggerDeduplicator.shouldSkipLog(logRecord)) {
      return;
    }
    if (this.pendingLogRecords.length >= LOGGER_MAX_QUEUE_SIZE) {
      this.pendingLogRecords.shift();
    }

    this.pendingLogRecords.push(logRecord);
    if (this.pendingLogRecords.length >= LOGGER_BATCH_SIZE) {
      void this.flushPendingLogs();
    }
  }

  async flushPendingLogs(): Promise<void> {
    if (this.pendingLogRecords.length === 0) {
      return;
    }

    const logBatchToSend = [...this.pendingLogRecords];

    this.pendingLogRecords = [];

    try {
      await this.loggerTransport.send(logBatchToSend);
    } catch {
      await loggerRetryQueue.retryFailedBatch({
        logRecords: logBatchToSend,

        currentRetryAttempt: 0,
      });
    }
  }

  private startAutomaticFlushScheduler(): void {
    window.setInterval(() => {
      void this.flushPendingLogs();
    }, LOGGER_FLUSH_INTERVAL_IN_MS);
  }

  private registerPageCloseListeners(): void {
    const flushLogsBeforePageClose = (): void => {
      if (this.pendingLogRecords.length === 0) {
        return;
      }

      const logBatchToSend = [...this.pendingLogRecords];

      this.pendingLogRecords = [];

      this.loggerTransport.sendOnPageClose(logBatchToSend);
    };

    window.addEventListener('beforeunload', flushLogsBeforePageClose);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushLogsBeforePageClose();
      }
    });
  }
}

export const loggerQueue = new LoggerQueue();
