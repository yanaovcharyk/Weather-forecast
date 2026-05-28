export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Додаткові metadata поля для логів.
 */
export type LogMetadata = Record<string, unknown>;

/**
 * Context logger-а.
 */
export interface ILoggerContext {
  requestId?: string;

  userId?: string;

  sessionId?: string;

  route?: string;

  context?: string;
}

/**
 * Внутрішня модель логу.
 */
export interface ClientLogRecord {
  timestamp: string;

  level: LogLevel;

  message: string;

  requestId?: string;

  userId?: string;

  sessionId?: string;

  route?: string;

  metadata?: LogMetadata;
}

/**
 * DTO для network transport.
 *
 * Object поля serialize-яться у string.
 */
export interface SerializedClientLogRecord {
  timestamp: string;

  level: LogLevel;

  message: string;

  requestId?: string;

  userId?: string;

  sessionId?: string;

  route?: string;

  metadata?: string;
}

/**
 * GraphQL request body.
 */
export interface SendLogsGraphQLRequestBody {
  query: string;

  variables: {
    input: SerializedClientLogRecord[];
  };
}
