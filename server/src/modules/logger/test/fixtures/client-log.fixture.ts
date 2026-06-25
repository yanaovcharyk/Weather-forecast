import { ClientLogInput } from '@logger/dto';

export const ClientInfoLog: ClientLogInput = {
  timestamp: '2024-01-01T10:00:00.000Z',
  level: 'info',
  message: 'info message',
  requestId: 'req-1',
  userId: 'user-1',
  sessionId: 'session-1',
  route: '/cities',
};

export const ClientWarnLog: ClientLogInput = {
  ...ClientInfoLog,
  level: 'warn',
  message: 'warn message',
};

export const ClientErrorLog: ClientLogInput = {
  ...ClientInfoLog,
  level: 'error',
  message: 'error message',
};

export const ClientDebugLog: ClientLogInput = {
  ...ClientInfoLog,
  level: 'debug',
  message: 'debug message',
};
