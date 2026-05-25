export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export type LogMeta = Record<string, unknown>;

export interface ILoggerContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  route?: string;
  context?: string;
}
