import { LOGGER_BATCH_SIZE, LOGGER_FLUSH_INTERVAL_IN_MS } from '../constants';
import type { ClientLogRecord } from '../types';
import { GraphQLLoggerTransport } from './GraphQLLoggerTransport';
import { loggerRetryQueue } from './LoggerRetryService';
import { loggerDeduplicator } from '../guards/LoggerDeduplicator';

export class LoggerQueue {
  private queuedLogs: ClientLogRecord[] = [];

  private readonly loggerTransport = new GraphQLLoggerTransport();

  constructor() {
    this.startAutoSendScheduler();
    this.registerPageCloseListeners();
  }

  addLog(logRecord: ClientLogRecord): void {
    if (loggerDeduplicator.shouldSkipLog(logRecord)) {
      return;
    }

    this.queuedLogs.push(logRecord);

    if (this.queuedLogs.length >= LOGGER_BATCH_SIZE) {
      this.sendQueuedLogs().catch((error: unknown) => {
        console.error('Failed to send queued logs', error);
      });
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
      this.sendQueuedLogs().catch((error: unknown) => {
        console.error('Failed to auto send logs', error);
      });
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
}

export const loggerQueue = new LoggerQueue();
