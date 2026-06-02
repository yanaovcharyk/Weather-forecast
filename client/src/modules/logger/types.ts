export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export type LogMetadata = Record<string, unknown>;

export interface ILoggerContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  route?: string;
  context?: string;
}

export interface ClientLogRecord {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  route?: string;
  metadata?: JsonValue;
}

export interface LoggerContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  route?: string;
}

export interface ClientLogRecord extends LoggerContext {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: JsonValue;
}

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

export interface SendLogsGraphQLRequestBody {
  query: string;
  variables: {
    input: SerializedClientLogRecord[];
  };
}

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export const DEFAULT_FIELDS_TO_MASK = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'set-cookie',
  'secret',
  'apiKey',
] as const;

export type ClientErrorLog = {
  module: string;
  requestId: string;
  operationName: string;
  executionTimeMs: number;
  error: {
    name?: string;
    message: string;
    stack?: string;
    code?: string;
  };
  variables?: unknown;
};

export interface ILoggerTransport {
  send(logRecords: ClientLogRecord[]): Promise<void>;
  sendOnPageClose(logRecords: ClientLogRecord[]): void;
}
