import { loggerContext } from './LoggerContextStore';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

type LogMeta = Record<string, unknown>;

class Logger {
  info(message: string, meta?: LogMeta) {
    this.write('info', message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.write('warn', message, meta);
  }

  error(message: string, meta?: LogMeta) {
    this.write('error', message, meta);
  }

  debug(message: string, meta?: LogMeta) {
    if (import.meta.env.DEV) {
      this.write('debug', message, meta);
    }
  }

  private write(level: LogLevel, message: string, meta?: LogMeta) {
    const payload = {
      timestamp: new Date().toISOString(),

      level,

      message,

      ...loggerContext.get(),

      ...(meta ?? {}),
    };

    switch (level) {
      case 'info':
        console.info(payload);
        break;

      case 'warn':
        console.warn(payload);
        break;

      case 'error':
        console.error(payload);
        break;

      case 'debug':
        console.debug(payload);
        break;
    }
  }
}

export const logger = new Logger();
