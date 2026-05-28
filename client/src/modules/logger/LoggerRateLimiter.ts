import {
  LOGGER_MAX_LOGS_PER_MINUTE,
  LOGGER_RATE_LIMIT_WINDOW_IN_MS,
} from './constants';

export class LoggerRateLimiter {
  private logTimestamps: number[] = [];

  registerLogEvent(): void {
    const currentTimestamp = Date.now();

    this.logTimestamps.push(currentTimestamp);

    this.logTimestamps = this.logTimestamps.filter(
      (existingTimestamp) =>
        currentTimestamp - existingTimestamp < LOGGER_RATE_LIMIT_WINDOW_IN_MS,
    );

    if (this.logTimestamps.length > LOGGER_MAX_LOGS_PER_MINUTE) {
      throw new Error(
        [
          'Logger panic protection triggered.',
          'Too many logs generated.',
          'Possible infinite loop detected.',
        ].join(' '),
      );
    }
  }
}

export const loggerRateLimiter = new LoggerRateLimiter();
