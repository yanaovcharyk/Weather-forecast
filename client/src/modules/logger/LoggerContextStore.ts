import type { ILoggerContext } from './types';

class LoggerContextStore {
  private context: ILoggerContext = {};

  get(): ILoggerContext {
    return this.context;
  }

  set(partial: Partial<ILoggerContext>): void {
    this.context = {
      ...this.context,
      ...partial,
    };
  }

  clear(): void {
    this.context = {};
  }
}

export const loggerContext = new LoggerContextStore();
